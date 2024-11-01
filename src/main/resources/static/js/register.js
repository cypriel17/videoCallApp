function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function validateForm() {
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    let isValid = true;

    // Reset previous error states
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });

    // Validate username
    if (!username.value.match(/^[A-Za-z0-9\s]{2,}$/)) {
        document.getElementById('username-error').style.display = 'block';
        isValid = false;
    }

    // Validate email
    if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        document.getElementById('email-error').style.display = 'block';
        isValid = false;
    }

    // Validate password
    if (password.value.length < 6) {
        document.getElementById('password-error').style.display = 'block';
        isValid = false;
    }

    return isValid;
}

function handleRegistration(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');

    // Disable form while submitting
    form.classList.add('loading');
    submitButton.textContent = 'Creating account...';

    const user = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        status: 'online'
    };

    fetch('http://localhost:8080/api/v1/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response;
    }).then(() => {
        localStorage.setItem("connectedUser", JSON.stringify(user));
        window.location.href = "index.html";
    }).catch(error => {
        console.error('POST request error:', error);
    });
}

const registrationForm = document.getElementById("registrationForm");
registrationForm.addEventListener("submit", handleRegistration);