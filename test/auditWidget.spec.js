import auditWidget from '../src/auditWidget';
import MockVss from './VSS.mock';
import JSZip from 'jszip';
const path = require('path');

describe('auditWidget', () => {
  it('tid-0: handles no results', () => {
    expect.assertions(2);
    const VSS = new MockVss({ zipFile: null });

    return new Promise((resolve) =>
      auditWidget(VSS, JSZip, (renderedApp, data) => {
        expect(data).toEqual(null);
        expect(renderedApp).toMatchSnapshot();
        resolve();
      })
    );
  });

  it('tid-1: handles moderate render', () => {
    expect.assertions(1);
    const VSS = new MockVss({ zipFile: path.join('tid-1', 'audit_results.zip') });

    return new Promise((resolve) =>
      auditWidget(VSS, JSZip, (renderedApp) => {
        expect(renderedApp).toMatchSnapshot();
        resolve();
      })
    );
  });

  it('tid-2: handles critical render', () => {
    expect.assertions(1);
    const VSS = new MockVss({ zipFile: path.join('tid-2', 'audit_results.zip')  });

    return new Promise((resolve) =>
      auditWidget(VSS, JSZip, (renderedApp) => {
        expect(renderedApp).toMatchSnapshot();
        resolve();
      })
    );
  });

  it('tid-3: handles high render', () => {
    expect.assertions(1);
    const VSS = new MockVss({ zipFile: path.join('tid-3', 'audit_results.zip')  });

    return new Promise((resolve) =>
      auditWidget(VSS, JSZip, (renderedApp) => {
        expect(renderedApp).toMatchSnapshot();
        resolve();
      })
    );
  });

  it('tid-4: handles low render', () => {
    expect.assertions(1);
    const VSS = new MockVss({ zipFile: path.join('tid-4', 'audit_results.zip')  });

    return new Promise((resolve) =>
      auditWidget(VSS, JSZip, (renderedApp) => {
        expect(renderedApp).toMatchSnapshot();
        resolve();
      })
    );
  });

  it('tid-5: handles ok render', () => {
    expect.assertions(1);
    const VSS = new MockVss({ zipFile: path.join('tid-5', 'audit_results.zip')  });

    return new Promise((resolve) =>
      auditWidget(VSS, JSZip, (renderedApp) => {
        expect(renderedApp).toMatchSnapshot();
        resolve();
      })
    );
  });

  it('tid-6: handles no builds', () => {
    expect.assertions(1);
    const VSS = new MockVss({ zipFile: null, noBuilds: true });

    return new Promise((resolve) =>
      auditWidget(VSS, JSZip, (renderedApp) => {
        expect(renderedApp).toMatchSnapshot();
        resolve();
      })
    );
  });

  it('tid-7: handles no settings', () => {
    expect.assertions(1);
    const VSS = new MockVss({ zipFile: null, noBuilds: true, noSettings: true });

    return new Promise((resolve) =>
      auditWidget(VSS, JSZip, (renderedApp) => {
        expect(renderedApp).toMatchSnapshot();
        resolve();
      })
    );
  });

  it('tid-8: handles reload', () => {
    expect.assertions(2);
    const VSS = new MockVss({ zipFile: path.join('tid-8', 'audit_results.zip')   });

    var called = 0;
    return new Promise((resolve) =>
      auditWidget(VSS, JSZip, (renderedApp) => {
        called++;
        if (called === 1) {
          expect(renderedApp).toMatchSnapshot();
          VSS.reload();
        } else if (called === 2) {
          expect(renderedApp).toMatchSnapshot();
          resolve();
        }
      })
    );
  });
});