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

describe('validateEmailField', () => {
  let dom;
  let validateEmailField;
  let document;

  beforeAll(async () => {
    dom = await loadDom();
    validateEmailField = dom.window.eval('validateEmailField');
    document = dom.window.document;
  });

  afterAll(() => {
    dom.window.close();
  });

  beforeEach(() => {
    document.getElementById('emailError').style.display = '';
  });

  test('rejects invalid email addresses', () => {
    const emailInput = document.getElementById('email');
    emailInput.value = 'a@b';

    const result = validateEmailField(
      emailInput,
      'emailError',
      'Please enter a valid email address.'
    );

    expect(result).toBe(false);
    expect(document.getElementById('emailError').style.display).toBe('block');
  });

  test('accepts multi-segment domain emails', () => {
    const emailInput = document.getElementById('email');
    emailInput.value = 'john@domain.co.uk';

    const result = validateEmailField(
      emailInput,
      'emailError',
      'Please enter a valid email address.'
    );

    expect(result).toBe(true);
    expect(document.getElementById('emailError').style.display).toBe('none');
  });
});
