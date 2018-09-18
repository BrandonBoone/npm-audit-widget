import app from '../src/auditWidget';
import MockVss from './VSS.mock';
import $ from './jquery.mock';
import JSZip from 'jszip';

describe('app', () => {
    it('handles initialization', () => {
        const VSS = new MockVss();
        const App = new app(VSS, JSZip, $);
    });
});