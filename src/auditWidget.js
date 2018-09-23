const _render = (severities, title) => {
  const severityKeys = ['critical', 'high', 'moderate', 'low'];
  let numOfIssues = 'N/A';
  let footerText = 'no audit_results';
  let backgroundColor = ''
  let color = '#000000';

  if (severities) {
    numOfIssues = severityKeys.reduce((prev, next) => prev + (severities[next] || 0), 0);
    footerText = severityKeys.reduce((prev, next) => `${prev ? `${prev}, `: prev } ${next.charAt(0)}: ${(severities[next] || 0)}`, '');
    
    if (severities['critical']) {
      backgroundColor = '#DA0A00';
      color = '#ffffff';
    } else if (severities['high']) {
      backgroundColor = '#FF6201';
      color = '#ffffff';
    } else if (severities['moderate']) {
      backgroundColor = '#F08700';
      color = '#ffffff';
    } else if (severities['low']) {
      backgroundColor = '#F8A800';
      color = '#000';
    } else {
      backgroundColor = '#107C10';
      color = '#ffffff'
    }
  }
  return `
<div id='widget' class='widget' style='${color ? `color:${color};`: ''}${backgroundColor ? `background-color:${backgroundColor};`: ''}'>
  <h2 class="title">${title}</h2>
  <div class="big-count truncated-text-ellipsis">${numOfIssues}</div>
  <div class="footer truncated-text-ellipsis">${footerText}</div>
  <div class="footer truncated-text-ellipsis">
    <a style='${color ? `color:${color};`: ''}' href="https://docs.npmjs.com/getting-started/running-a-security-audit">npm audit</a> results
  </div>
</div>`;
}

const _getZipData = ({ client, buildId, projectId, JSZip }) =>
  client.getArtifactContentZip(buildId, 'audit_results', projectId)
  .then((zipArrayBuffer) => {
    if (!zipArrayBuffer) {
      return null;
    }
    return JSZip.loadAsync(zipArrayBuffer)
    .then((zip) => zip.file('audit_results/audit.json').async('string'))
    .then((auditJson) =>  JSON.parse(auditJson));
  });

const _showWarnings = ({ callback, VSS, JSZip, WidgetHelpers, BuildRestClient, BuildContracts }) =>
  (widgetSettings) => {
    var customSettings = JSON.parse(widgetSettings.customSettings.data);
    if (!customSettings) {
      return WidgetHelpers.WidgetStatusHelper.Success();
    }

    const projectId = VSS.getWebContext().project.id;       
    const client = BuildRestClient.getClient();

    client.getBuilds(projectId, [customSettings.definitionId])
    .then((builds) => {
      if (builds.length > 0) {
        return _getZipData({ client, buildId: builds[0].id, projectId, JSZip })
        .then((auditData) => callback(
          _render(auditData && auditData.metadata && auditData.metadata.vulnerabilities, customSettings.buildName),
          auditData
        ));
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
