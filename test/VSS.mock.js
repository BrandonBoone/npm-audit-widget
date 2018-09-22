const fs = require('fs');
const path = require('path');

function mockWidgetHelpers () {
  this.IncludeWidgetStyles = () => {};
  this.WidgetStatusHelper = {
    Success: () => {}
  };
}

function mockBuildClient (zipFile) {
  this.getClient = () => {
    let bufferedZip = null;
    if (zipFile)
    {
      let zipPath = path.join(__dirname, zipFile);
      bufferedZip = fs.readFileSync(zipPath, null).buffer;
    }
    return {
      getArtifactContentZip: () => Promise.resolve(bufferedZip),
      getBuilds: () => Promise.resolve([{id: 5655}]),
    };
  }
}

export default function({ zipFile }) {
  this._app = null;
  this.init = () => { };
  this.register = (name, callback) => { this._app = callback(); }
  this.require = (modules, callback) => {
    var resolvedModules = modules.map((module) => {
      switch (module) {
        case 'TFS/Dashboards/WidgetHelpers':
          return new mockWidgetHelpers();
        case 'TFS/Build/RestClient': 
          return new mockBuildClient(zipFile);
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