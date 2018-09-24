const fs = require('fs');
const path = require('path');

function mockWidgetHelpers () {
  this.IncludeWidgetStyles = () => {};
  this.WidgetStatusHelper = {
    Success: () => {}
  };
}

function mockBuildClient (zipFile, noBuilds) {
  this.getClient = () => {
    let bufferedZip = null;
    if (zipFile)
    {
      let zipPath = path.join(__dirname, zipFile);
      bufferedZip = fs.readFileSync(zipPath, null).buffer;
    }
    return {
      getArtifactContentZip: () => Promise.resolve(bufferedZip),
      getBuilds: () => Promise.resolve(!noBuilds ? [{id: 5655}] : null),
    };
  }
}

export default function({ zipFile, noBuilds, noSettings }) {
  this._app = null;
  this.init = () => { };
  this.register = (name, callback) => { this._app = callback(); }
  this.require = (modules, callback) => {
    var resolvedModules = modules.map((module) => {
      switch (module) {
        case 'TFS/Dashboards/WidgetHelpers':
          return new mockWidgetHelpers();
        case 'TFS/Build/RestClient': 
          return new mockBuildClient(zipFile, noBuilds);
      }
    });
    callback(...resolvedModules);
  };
  this.notifyLoadSucceeded = () => {
    this._app.load({
      customSettings: {
        data: !noSettings ? JSON.stringify({
          definitionId: 5655,
          buildName: 'TRUNK',
        }) : null
      }
    });
  };

  this.reload = () => {
    this._app.reload({
      customSettings: {
        data: !noSettings ? JSON.stringify({
          definitionId: 5655,
          buildName: 'TRUNK2',
        }) : null
      }
    });
  };

  this.getWebContext = () => ({
    project: {
      id: '31582f6f-c133-44ed-8113-3b4a3eecae9d'
    }
  });
}