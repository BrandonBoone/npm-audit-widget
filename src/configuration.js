export default function configuration(VSS) {
    VSS.init({
        explicitNotifyLoaded: true,
        setupModuleLoader: true,
        usePlatformScripts: true,
        usePlatformStyles: true
    });

    VSS.require(["TFS/Dashboards/WidgetHelpers", "TFS/Build/RestClient"], function (WidgetHelpers, Build_Client) {
        WidgetHelpers.IncludeWidgetConfigurationStyles();
        VSS.register("npmAuditWidget.Configuration", function () {
            var configuration = new Configuration(WidgetHelpers, Build_Client);
            return configuration;
        });
        VSS.notifyLoadSucceeded();
    });
    var Configuration = (function () {
        function Configuration(WidgetHelpers, Build_Client) {
            this.Build_Client = Build_Client;
            this.WidgetHelpers = WidgetHelpers;
            this.widgetConfigurationContext = null;
            this.$select = $('select');

            
        }
        Configuration.prototype.load = function (widgetSettings, widgetConfigurationContext) {
            var _this = this;
            this.widgetConfigurationContext = widgetConfigurationContext;
            var settings = JSON.parse(widgetSettings.customSettings.data);
            this.showBuilds(settings);

            // Change notification
            this.$select.change(function () {
                _this.widgetConfigurationContext.notify(_this.WidgetHelpers.WidgetEvent.ConfigurationChange, _this.WidgetHelpers.WidgetEvent.Args(_this.getCustomSettings()));
            });

            return this.WidgetHelpers.WidgetStatusHelper.Success();
        };
        Configuration.prototype.onSave = function () {
            var isValid = true;
            if (isValid) {
                return this.WidgetHelpers.WidgetConfigurationSave.Valid(this.getCustomSettings());
            }
            else {
                return this.WidgetHelpers.WidgetConfigurationSave.Invalid();
            }
        };
        Configuration.prototype.showBuilds = function (settings) {
            var _this = this;
            // Get the available builds.
            var projectId = VSS.getWebContext().project.id;
            this.Build_Client.getClient().getDefinitions(projectId).then(function (definitions) {
                for (var i = 0; i < definitions.length; i++) {
                    var opt = document.createElement('option');
                    opt.value = definitions[i].id.toString();
                    opt.innerHTML = definitions[i].name;
                    _this.$select[0].appendChild(opt);
                }
            });
            // Select the configured build, or default
            if (settings && settings.definitionId) {
                this.$select.val(settings.definitionId);
            }
        };
        Configuration.prototype.getCustomSettings = function () {
            var build = this.$select.val();
            var name = $("#build-dropdown option:selected").text();
            var result = {
                data: JSON.stringify({
                    definitionId: build,
                    buildName: name
                })
            };
            return result;
        };
        return Configuration;
    })();
}