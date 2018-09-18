const fs = require('fs');
const path = require('path');

var zipPath = path.join(__dirname, 'audit_results.zip');
var bufferedZip = fs.readFileSync(zipPath, null).buffer;

function mockWidgetHelpers () {
    this.IncludeWidgetStyles = () => {};
    this.WidgetStatusHelper = {
        Success: () => {}
    };
}

function mockBuildClient () {
    this.getClient = () => {
        return {
            getArtifactContentZip: () => Promise.resolve(bufferedZip),
            getBuilds: () => Promise.resolve([{id: 5655}]),
        };
    }
}

export default function() {
    this._app = null;
    this.init = () => { };
    this.register = (name, callback) => { this._app = callback(); }
    this.require = (modules, callback) => {
        var resolvedModules = modules.map((module) => {
            switch (module) {
                case 'TFS/Dashboards/WidgetHelpers':
                    return new mockWidgetHelpers();
                case 'TFS/Build/RestClient': 
                    return new mockBuildClient();
            }
        });
        callback(...resolvedModules);
    };
    this.notifyLoadSucceeded = () => {
        this._app.load({
            customSettings: {
                data: JSON.stringify({
                    definitionId: 5655,
                })
            }
        });
    };
    this.getWebContext = () => ({
        project: {
            id: '31582f6f-c133-44ed-8113-3b4a3eecae9d'
        }
    });
}