export default function auditWidget(VSS, JSZip, $jq) {

    VSS.init({                        
        explicitNotifyLoaded: true,
        usePlatformStyles: true
    });

    this._getData = (client, buildId, projectId) =>
        client.getArtifactContentZip(buildId, 'audit_results', projectId)
        .then((zipArrayBuffer) => JSZip.loadAsync(zipArrayBuffer))
        .then((zip) => zip.file('audit_results/audit.json').async('string'))
        .then((auditJson) => {
            const auditData = JSON.parse(auditJson);
            return Object.keys(auditData.advisories)
                .reduce((prev, key) => {
                    const advisory = auditData.advisories[key];
                    
                    prev[advisory.severity] = (prev[advisory.severity] || 0) + 1;

                    return prev;
                }, {});
        });

    this._paint = (severities, msg) => {
        const widgetArea = window.$('.widget');
        const body = window.$('body');
        const footer = window.$('#footer');
        const count = window.$('#count');
        const severityKeys = ['critical', 'high', 'moderate', 'low'];
        
        if (severities) {
            const numOfIssues = severityKeys.reduce((prev, next) => prev + (severities[next] || 0), 0);
            const footerText = severityKeys.reduce((prev, next) => `${prev ? `${prev}, `: prev } ${next.charAt(0)}: ${(severities[next] || 0)}`, '');
            
            footer.text(footerText);
            count.text(numOfIssues);

            if (severities['critical']) {
                body.css('background-color', '#da0a00');
            } else if (severities['high']) {
                body.css('background-color', '#D88C00');
            } else if (severities['moderate']) {
                body.css('background-color', '#CFD600');
            } else if (severities['low']) {
                body.css('background-color', '#CFD600');
            }
        } else if (!msg) {
            body.css('background-color', '#107c10');
        }
    }

    this._showWarnings = (widgetSettings, WidgetHelpers, BuildRestClient, BuildContracts) => {
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
                return this._getData(client, builds[0].id, projectId)
                .then((severities) => this._paint(severities));
            }
        })
        return WidgetHelpers.WidgetStatusHelper.Success();
    }


    VSS.require(['TFS/Dashboards/WidgetHelpers', 'TFS/Build/RestClient', 'TFS/Build/Contracts'], (...args) => {
        // require automatically loads jquery.
        if(!window.$){
            window.$ = $jq;
        }
        const [ WidgetHelpers ] = args;
        WidgetHelpers.IncludeWidgetStyles();   
        VSS.register('npmAuditWidget', () => ({  
            load: (widgetSettings) => this._showWarnings(widgetSettings, ...args),
            reload: (widgetSettings) => this._showWarnings(widgetSettings, ...args)
        }));
        VSS.notifyLoadSucceeded();
    });
}
