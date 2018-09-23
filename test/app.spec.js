import app from '../src/auditWidget';
import MockVss from './VSS.mock';
import JSZip from 'jszip';
const path = require('path');

describe('app', () => {
  it('tid-1: handles moderate render', () => {
    expect.assertions(1);
    const VSS = new MockVss({ zipFile: path.join('tid-1', 'audit_results.zip') });

    return new Promise((resolve) =>
      app(VSS, JSZip, (renderedApp) => {
        expect(renderedApp).toEqual(
`
<div id='widget' class='widget' style='color:#ffffff;background-color:#F08700;'>
  <h2 class="title">TRUNK</h2>
  <div class="big-count truncated-text-ellipsis">10</div>
  <div class="footer truncated-text-ellipsis"> c: 0,  h: 0,  m: 10,  l: 0</div>
  <div class="footer truncated-text-ellipsis">
    <a style='color:#ffffff;' href="https://docs.npmjs.com/getting-started/running-a-security-audit">npm audit</a> results
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
<div id='widget' class='widget' style='color:#ffffff;background-color:#DA0A00;'>
  <h2 class="title">TRUNK</h2>
  <div class="big-count truncated-text-ellipsis">15</div>
  <div class="footer truncated-text-ellipsis"> c: 1,  h: 4,  m: 10,  l: 0</div>
  <div class="footer truncated-text-ellipsis">
    <a style='color:#ffffff;' href="https://docs.npmjs.com/getting-started/running-a-security-audit">npm audit</a> results
  </div>
</div>`
        );
        resolve();
      })
    );
  });

  it('tid-3: handles no results', () => {
    expect.assertions(2);
    const VSS = new MockVss({ zipFile: null });

    return new Promise((resolve) =>
      app(VSS, JSZip, (renderedApp, data) => {
        expect(data).toEqual(null);
        expect(renderedApp).toEqual(
`
<div id='widget' class='widget' style='color:#000000;'>
  <h2 class="title">TRUNK</h2>
  <div class="big-count truncated-text-ellipsis">N/A</div>
  <div class="footer truncated-text-ellipsis">no audit_results</div>
  <div class="footer truncated-text-ellipsis">
    <a style='color:#000000;' href="https://docs.npmjs.com/getting-started/running-a-security-audit">npm audit</a> results
  </div>
</div>`
        );
        resolve();
      })
    );
  });
});