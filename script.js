document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('sarForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            generateEmail();
        }
    });

    nameInput.addEventListener('input', () => {
        validateField(nameInput, 'nameError', 'Please enter your full name.');
    });

    emailInput.addEventListener('input', () => {
        validateEmailField(emailInput, 'emailError', 'Please enter a valid email address.');
    });
});

// Validate the entire form
const validateForm = () => {
    const name = document.getElementById('name');
    const email = document.getElementById('email');

    return validateField(name, 'nameError', 'Please enter your full name.') &&
        validateEmailField(email, 'emailError', 'Please enter a valid email address.');
};

// Validate individual field
const validateField = (field, errorId, errorMessage) => {
    const errorElement = document.getElementById(errorId);
    if (!field.checkValidity()) {
        showError(errorElement, errorMessage);
        return false;
    }
    hideError(errorElement);
    return true;
};

// Validate email field with custom validation
const validateEmailField = (field, errorId, errorMessage) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,24}$/;
    const errorElement = document.getElementById(errorId);

    if (!emailRegex.test(field.value)) {
        showError(errorElement, errorMessage);
        return false;
    }
    hideError(errorElement);
    return true;
};

// Show error message
const showError = (element, message) => {
    element.textContent = message;
    element.style.display = 'block';
};

// Hide error message
const hideError = (element) => {
    element.style.display = 'none';
};

// Generate the email content
const generateEmail = () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const gmcNumber = document.getElementById('gmcNumber').value;
    const receiverEmail = "foi@gmc-uk.org";
    const subject = "Subject Access Request - Physician and Anaesthesia Associates Consultation";

    let body = `Dear Sir/Madam,

I hope this email finds you well. I am writing to make a Subject Access Request under the Data Protection Act 2018 and the UK General Data Protection Regulation (UK GDPR).

Name: ${name}
Email: ${email}`;

    if (gmcNumber) {
        body += `\nGMC Number: ${gmcNumber}`;
    }

    body += `

I am requesting access to any personal data you hold about me in relation to the public consultation on Physician and Anaesthesia Associates which closed on 19th May 2024. This includes, but is not limited to, any submissions, comments, or feedback I may have provided during the consultation process.

Please provide me with copies of this information in a commonly used electronic format.

If you need any further information from me to identify my personal data, please let me know as soon as possible. I look forward to receiving the requested information within one month, as required by the UK GDPR.

Thank you for your assistance in this matter.

Yours faithfully,
${name}`;

    document.getElementById('receiverEmail').textContent = receiverEmail;
    document.getElementById('emailSubject').textContent = subject;
    typeWriterEffect(body, 'emailBody', 11);
    toggleVisibility('sarForm', 'emailTemplate');
    updateSendEmailButton(receiverEmail, subject, body);
};

// Copy email content to clipboard
const copyToClipboard = () => {
    const emailContent = document.querySelector('.email-content').innerText;

    navigator.clipboard.writeText(emailContent)
        .then(() => alert('Email content copied to clipboard!'))
        .catch(err => console.error('Could not copy text: ', err));
};

// Show the form (Hide the email template)
const showForm = () => {
    toggleVisibility('emailTemplate', 'sarForm');
};

// Toggle visibility of elements
const toggleVisibility = (hideId, showId) => {
    document.getElementById(hideId).classList.add('hidden');
    document.getElementById(showId).classList.remove('hidden');
    document.getElementById(showId).classList.add('fade-in');
};

// Typewriter effect for the email body
const typeWriterEffect = (text, elementId, speed) => {
    const element = document.getElementById(elementId);
    element.textContent = '';
    let i = 0;

    const typeWriter = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    };

    typeWriter();
};

// Update send email button with mailto link
const updateSendEmailButton = (receiverEmail, subject, body) => {
    const mailtoLink = `mailto:${receiverEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.getElementById('sendEmailBtn').onclick = () => {
        window.location.href = mailtoLink;
    };
};