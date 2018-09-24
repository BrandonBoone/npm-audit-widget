import app from '../src/auditWidget';
import MockVss from './VSS.mock';
import JSZip from 'jszip';
const path = require('path');

describe('app', () => {
  it('tid-0: handles no results', () => {
    expect.assertions(2);
    const VSS = new MockVss({ zipFile: null });

    return new Promise((resolve) =>
      app(VSS, JSZip, (renderedApp, data) => {
        expect(data).toEqual(null);
        expect(renderedApp).toEqual(
`
<div id="widget" class="widget" style="color:#000000;">
  <h2 class="title">TRUNK</h2>
  <div class="big-count truncated-text-ellipsis">N/A</div>
  <div class="footer truncated-text-ellipsis">no audit_results</div>
  <div class="footer truncated-text-ellipsis">
    <a style="color:#000000;" href="https://docs.npmjs.com/getting-started/running-a-security-audit">npm audit</a> results
  </div>
</div>`
        );
        resolve();
      })
    );
  });

  it('tid-1: handles moderate render', () => {
    expect.assertions(1);
    const VSS = new MockVss({ zipFile: path.join('tid-1', 'audit_results.zip') });

    return new Promise((resolve) =>
      app(VSS, JSZip, (renderedApp) => {
        expect(renderedApp).toEqual(
`
<div id="widget" class="widget" style="color:#ffffff;background-color:#F08700;">
  <h2 class="title">TRUNK</h2>
  <div class="big-count truncated-text-ellipsis">10</div>
  <div class="footer truncated-text-ellipsis"> c: 0,  h: 0,  m: 10,  l: 0</div>
  <div class="footer truncated-text-ellipsis">
    <a style="color:#ffffff;" href="https://docs.npmjs.com/getting-started/running-a-security-audit">npm audit</a> results
  </div>
</div>`
        );
        resolve();
      })
    );
  });

  it('tid-2: handles critical render', () => {
    expect.assertions(1);
    const VSS = new MockVss({ zipFile: path.join('tid-2', 'audit_results.zip')  });

    return new Promise((resolve) =>
      app(VSS, JSZip, (renderedApp) => {
        expect(renderedApp).toEqual(
`
<div id="widget" class="widget" style="color:#ffffff;background-color:#DA0A00;">
  <h2 class="title">TRUNK</h2>
  <div class="big-count truncated-text-ellipsis">15</div>
  <div class="footer truncated-text-ellipsis"> c: 1,  h: 4,  m: 10,  l: 0</div>
  <div class="footer truncated-text-ellipsis">
    <a style="color:#ffffff;" href="https://docs.npmjs.com/getting-started/running-a-security-audit">npm audit</a> results
  </div>
</div>`
        );
        resolve();
      })
    );
  });

  it('tid-3: handles high render', () => {
    expect.assertions(1);
    const VSS = new MockVss({ zipFile: path.join('tid-3', 'audit_results.zip')  });

    return new Promise((resolve) =>
      app(VSS, JSZip, (renderedApp) => {
        expect(renderedApp).toEqual(
`
<div id="widget" class="widget" style="color:#ffffff;background-color:#FF6201;">
  <h2 class="title">TRUNK</h2>
  <div class="big-count truncated-text-ellipsis">11</div>
  <div class="footer truncated-text-ellipsis"> c: 0,  h: 1,  m: 10,  l: 0</div>
  <div class="footer truncated-text-ellipsis">
    <a style="color:#ffffff;" href="https://docs.npmjs.com/getting-started/running-a-security-audit">npm audit</a> results
  </div>
</div>`
        );
        resolve();
      })
    );
  });

  it('tid-4: handles low render', () => {
    expect.assertions(1);
    const VSS = new MockVss({ zipFile: path.join('tid-4', 'audit_results.zip')  });

    return new Promise((resolve) =>
      app(VSS, JSZip, (renderedApp) => {
        expect(renderedApp).toEqual(
`
<div id="widget" class="widget" style="color:#000;background-color:#F8A800;">
  <h2 class="title">TRUNK</h2>
  <div class="big-count truncated-text-ellipsis">1</div>
  <div class="footer truncated-text-ellipsis"> c: 0,  h: 0,  m: 0,  l: 1</div>
  <div class="footer truncated-text-ellipsis">
    <a style="color:#000;" href="https://docs.npmjs.com/getting-started/running-a-security-audit">npm audit</a> results
  </div>
</div>`
        );
        resolve();
      })
    );
  });

  it('tid-5: handles ok render', () => {
    expect.assertions(1);
    const VSS = new MockVss({ zipFile: path.join('tid-5', 'audit_results.zip')  });

    return new Promise((resolve) =>
      app(VSS, JSZip, (renderedApp) => {
        expect(renderedApp).toEqual(
`
<div id="widget" class="widget" style="color:#ffffff;background-color:#107C10;">
  <h2 class="title">TRUNK</h2>
  <div class="big-count truncated-text-ellipsis">0</div>
  <div class="footer truncated-text-ellipsis"> c: 0,  h: 0,  m: 0,  l: 0</div>
  <div class="footer truncated-text-ellipsis">
    <a style="color:#ffffff;" href="https://docs.npmjs.com/getting-started/running-a-security-audit">npm audit</a> results
  </div>
</div>`
        );
        resolve();
      })
    );
  });

  it('tid-6: handles no builds', () => {
    expect.assertions(1);
    const VSS = new MockVss({ zipFile: null, noBuilds: true });

    return new Promise((resolve) =>
      app(VSS, JSZip, (renderedApp) => {
        expect(renderedApp).toEqual(
`
<div id="widget" class="widget" style="color:#000000;">
  <h2 class="title">null</h2>
  <div class="big-count truncated-text-ellipsis\">N/A</div>
  <div class="footer truncated-text-ellipsis">no audit_results</div>
  <div class="footer truncated-text-ellipsis">
    <a style="color:#000000;" href="https://docs.npmjs.com/getting-started/running-a-security-audit">npm audit</a> results
  </div>
</div>`
        );
        resolve();
      })
    );
  });

  it('tid-7: handles no settings', () => {
    expect.assertions(1);
    const VSS = new MockVss({ zipFile: null, noBuilds: true, noSettings: true });

    return new Promise((resolve) =>
      app(VSS, JSZip, (renderedApp) => {
        expect(renderedApp).toEqual(
 `<div id="widget" class="widget">
    <h2 class="title">npm audit widget</h2>
    <div class="big-count truncated-text-ellipsis">N/A</div>
    <div class="footer truncated-text-ellipsis">not configured</div>
  </div>`
        );
        resolve();
      })
    );
  });

  it('tid-8: handles reload', () => {
    expect.assertions(2);
    const VSS = new MockVss({ zipFile: path.join('tid-8', 'audit_results.zip')   });

    var called = 0;
    return new Promise((resolve) =>
      app(VSS, JSZip, (renderedApp) => {
        called++;

        if (called === 1) {
          expect(renderedApp).toEqual(
`
<div id="widget" class="widget" style="color:#ffffff;background-color:#107C10;">
  <h2 class="title">TRUNK</h2>
  <div class="big-count truncated-text-ellipsis">0</div>
  <div class="footer truncated-text-ellipsis"> c: 0,  h: 0,  m: 0,  l: 0</div>
  <div class="footer truncated-text-ellipsis">
    <a style="color:#ffffff;" href="https://docs.npmjs.com/getting-started/running-a-security-audit">npm audit</a> results
  </div>
</div>`
          );
          VSS.reload();
        } else if (called === 2) {
          expect(renderedApp).toEqual(
`
<div id="widget" class="widget" style="color:#ffffff;background-color:#107C10;">
  <h2 class="title">TRUNK2</h2>
  <div class="big-count truncated-text-ellipsis">0</div>
  <div class="footer truncated-text-ellipsis"> c: 0,  h: 0,  m: 0,  l: 0</div>
  <div class="footer truncated-text-ellipsis">
    <a style="color:#ffffff;" href="https://docs.npmjs.com/getting-started/running-a-security-audit">npm audit</a> results
  </div>
</div>`
          );
          resolve();
        }
      })
    );
  });
});