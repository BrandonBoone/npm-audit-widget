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
<div id='widget' class='widget' style='background-color:#CFD600;'>
  <h2 class="title">npm Security Risks</h2>
  <div class="big-count truncated-text-ellipsis">10</div>
  <div class="footer runcated-text-ellipsis"> c: 0,  h: 0,  m: 10,  l: 0</div>
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
<div id='widget' class='widget' style='background-color:#da0a00;'>
  <h2 class="title">npm Security Risks</h2>
  <div class="big-count truncated-text-ellipsis">15</div>
  <div class="footer runcated-text-ellipsis"> c: 1,  h: 4,  m: 10,  l: 0</div>
</div>`
        );
        resolve();
      })
    );
  });

  it('tid-3: handles no results', () => {
    expect.assertions(1);
    const VSS = new MockVss({ zipFile: null });

    return new Promise((resolve) =>
      app(VSS, JSZip, (renderedApp) => {
        expect(renderedApp).toEqual(
`
<div id='widget' class='widget' style='background-color:#107c10;'>
  <h2 class="title">npm Security Risks</h2>
  <div class="big-count truncated-text-ellipsis">N/A</div>
  <div class="footer runcated-text-ellipsis"></div>
</div>`
        );
        resolve();
      })
    );
  });
});