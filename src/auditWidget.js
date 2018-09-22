const _getData = ({ client, buildId, projectId, JSZip }) =>
  client.getArtifactContentZip(buildId, 'audit_results', projectId)
  .then((zipArrayBuffer) => {
    if (!zipArrayBuffer) {
      return null;
    }
    return JSZip.loadAsync(zipArrayBuffer)
    .then((zip) => zip.file('audit_results/audit.json').async('string'))
    .then((auditJson) => {
      const auditData = JSON.parse(auditJson);
      return auditData.metadata.vulnerabilities;

      // return Object.keys(auditData.advisories)
      //   .reduce((prev, key) => {
      //     const advisory = auditData.advisories[key];
          
      //     prev[advisory.severity] = (prev[advisory.severity] || 0) + 1;

      //     return prev;
      //   }, {});
    });
  });
  

const _paint = (severities, msg) => {
  const severityKeys = ['critical', 'high', 'moderate', 'low'];
  let numOfIssues = 'N/A';
  let footerText = '';
  let backgroundColor = ''

  if (severities) {
    numOfIssues = severityKeys.reduce((prev, next) => prev + (severities[next] || 0), 0);
    footerText = severityKeys.reduce((prev, next) => `${prev ? `${prev}, `: prev } ${next.charAt(0)}: ${(severities[next] || 0)}`, '');
    
    if (severities['critical']) {
      backgroundColor = '#da0a00';
    } else if (severities['high']) {
      backgroundColor = '#D88C00';
    } else if (severities['moderate']) {
      backgroundColor = '#CFD600';
    } else if (severities['low']) {
      backgroundColor = '#CFD600';
    }
  } else if (!msg) {
    backgroundColor = '#107c10';
  }
  return `
<div id='widget' class='widget' style='background-color:${backgroundColor};'>
  <h2 class="title">npm Security Risks</h2>
  <div class="big-count truncated-text-ellipsis">${numOfIssues}</div>
  <div class="footer runcated-text-ellipsis">${footerText}</div>
</div>`;
}

const _showWarnings = ({ callback, VSS, JSZip, WidgetHelpers, BuildRestClient, BuildContracts }) =>
  (widgetSettings) => {
    var customSettings = JSON.parse(widgetSettings.customSettings.data);
    if (!customSettings) {
      customSettings = {
        definitionId: null,
        buildName: null
      };
      return WidgetHelpers.WidgetStatusHelper.Success();
    }

    const projectId = VSS.getWebContext().project.id;       
    const client = BuildRestClient.getClient();

    client.getBuilds(projectId, [customSettings.definitionId])
    .then((builds) => {
      if (builds.length > 0) {
        return _getData({ client, buildId: builds[0].id, projectId, JSZip })
        .then((severities) => callback(_paint(severities)));
      }
    }); //todo: error handling
    return WidgetHelpers.WidgetStatusHelper.Success();
  }

export default (VSS, JSZip, callback) => {
  VSS.init({                        
    explicitNotifyLoaded: true,
    usePlatformStyles: true
  });

  VSS.require(
    ['TFS/Dashboards/WidgetHelpers', 'TFS/Build/RestClient', 'TFS/Build/Contracts'],
    (WidgetHelpers, BuildRestClient, BuildContracts) => {
      WidgetHelpers.IncludeWidgetStyles();
      const showWarnings = _showWarnings({ callback, VSS, JSZip, WidgetHelpers, BuildRestClient, BuildContracts });
      
      VSS.register('npmAuditWidget', () => ({  
        load: (widgetSettings) => showWarnings(widgetSettings),
        reload: (widgetSettings) => showWarnings(widgetSettings)
      }));
      VSS.notifyLoadSucceeded();
    }
  );
};
