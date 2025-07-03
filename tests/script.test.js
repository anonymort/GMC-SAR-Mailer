const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const htmlPath = path.resolve(__dirname, '../index.html');

async function loadDom() {
  const dom = await JSDOM.fromFile(htmlPath, {
    runScripts: 'dangerously',
    resources: 'usable'
  });

  // wait until DOMContentLoaded
  await new Promise(resolve => {
    dom.window.addEventListener('DOMContentLoaded', resolve);
  });
  return dom;
}

describe('generateEmail', () => {
  let dom;
  beforeAll(async () => {
    dom = await loadDom();
  });

  afterAll(() => {
    dom.window.close();
  });

  test('populates email fields', () => {
    jest.useFakeTimers();
    const { document } = dom.window;

    document.getElementById('name').value = 'John Doe';
    document.getElementById('email').value = 'john@example.com';

    dom.window.eval('generateEmail()');
    jest.runAllTimers();

    expect(document.getElementById('receiverEmail').textContent).toBe('foi@gmc-uk.org');
    expect(document.getElementById('emailSubject').textContent).toBe(
      'Subject Access Request - Physician and Anaesthesia Associates Consultation'
    );
    const body = document.getElementById('emailBody').textContent;
    expect(body).toContain('John Doe');
    expect(body).toContain('john@example.com');
  });
});
