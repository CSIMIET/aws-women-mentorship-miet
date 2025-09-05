const scriptURL = 'https://script.google.com/macros/s/AKfycbyZm_OINiHC1NmpTTcdrsMWXeRwmK93Zi1cKsFK9OPqYig9iZk4TiUp_6GjSym-0CnB/exec';

// Webex redirect URL
const WEBEX_REDIRECT_URL = 'https://amazon.webex.com/weblink/register/red490fe6feb78254bde9e16e7b9ed969';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn');
    const loadingMessage = document.getElementById('loadingMessage');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Initially disable the submit button
    submitBtn.disabled = true;
    submitBtn.style.backgroundColor = '#adb5bd';
    submitBtn.style.cursor = 'not-allowed';

    // Form validation functions
    function validateName(name) {
        return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
    }

    function validateRollNumber(rollNumber) {
        return rollNumber.trim().length > 0 && /^[a-zA-Z0-9]+$/.test(rollNumber.trim());
    }

    function validateClassSection(classSection) {
        // Optional field - always valid (no restrictions)
        return true;
    }

    function validateYear(year) {
        return year && (year === '3' || year === '4');
    }

    function validateBranch(branch) {
        return branch.trim().length >= 2;
    }

    function validateCollegeEmail(email) {
        const emailRegex = /^[^\s@]+@miet\.ac\.in$/;
        return emailRegex.test(email.trim());
    }

    function showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId);
        
        if (errorElement) {
            errorElement.textContent = message;
        }
        if (inputElement) {
            inputElement.classList.add('invalid');
            inputElement.classList.remove('valid');
        }
    }

    function clearError(fieldId) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId);
        
        if (errorElement) {
            errorElement.textContent = '';
        }
        if (inputElement) {
            inputElement.classList.remove('invalid');
            inputElement.classList.add('valid');
        }
    }

    function clearJoinGroupError() {
        const errorElement = document.getElementById('joinGroupError');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    function checkSubmitButton() {
        const joinGroupYes = document.querySelector('input[name="joinGroup"][value="yes"]');
        if (joinGroupYes && joinGroupYes.checked) {
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = '#6c757d';
            submitBtn.style.cursor = 'pointer';
        } else {
            submitBtn.disabled = true;
            submitBtn.style.backgroundColor = '#adb5bd';
            submitBtn.style.cursor = 'not-allowed';
        }
    }



    // Real-time validation
    document.getElementById('name').addEventListener('blur', function() {
        const name = this.value;
        if (!validateName(name)) {
            showError('name', 'Please enter a valid name (letters and spaces only, minimum 2 characters)');
        } else {
            clearError('name');
        }
    });

    document.getElementById('rollNumber').addEventListener('blur', function() {
        const rollNumber = this.value;
        if (!validateRollNumber(rollNumber)) {
            showError('rollNumber', 'Please enter a valid roll number (alphanumeric characters only)');
        } else {
            clearError('rollNumber');
        }
    });

    document.getElementById('classSection').addEventListener('blur', function() {
        const classSection = this.value;
        // Section is optional - always clear any errors
        clearError('classSection');
    });

    document.getElementById('year').addEventListener('change', function() {
        const year = this.value;
        if (!validateYear(year)) {
            showError('year', 'Please select a valid year');
        } else {
            clearError('year');
        }
    });

    document.getElementById('branch').addEventListener('blur', function() {
        const branch = this.value;
        if (!validateBranch(branch)) {
            showError('branch', 'Please enter a valid branch (minimum 2 characters)');
        } else {
            clearError('branch');
        }
    });

    document.getElementById('collegeEmail').addEventListener('blur', function() {
        const email = this.value;
        if (!validateCollegeEmail(email)) {
            showError('collegeEmail', 'Please enter a valid college email ending with @miet.ac.in');
        } else {
            clearError('collegeEmail');
        }
    });

    // Listen for WhatsApp group selection changes
    const joinGroupRadios = document.querySelectorAll('input[name="joinGroup"]');
    joinGroupRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            clearJoinGroupError();
            checkSubmitButton();
        });
    });

    // Form submission using the specified approach
    form.addEventListener('submit', e => {
        e.preventDefault();

        // Get form data for validation
        const formData = new FormData(form);
        
        // Validate all fields
        let isValid = true;
        const name = formData.get('name');
        const rollNumber = formData.get('rollNumber');
        const classSection = formData.get('classSection');
        const year = formData.get('year');
        const branch = formData.get('branch');
        const collegeEmail = formData.get('collegeEmail');
        const joinGroup = formData.get('joinGroup');

        if (!validateName(name)) {
            showError('name', 'Please enter a valid name (letters and spaces only, minimum 2 characters)');
            isValid = false;
        } else {
            clearError('name');
        }

        if (!validateRollNumber(rollNumber)) {
            showError('rollNumber', 'Please enter a valid roll number (alphanumeric characters only)');
            isValid = false;
        } else {
            clearError('rollNumber');
        }

        // Section is optional - no validation needed
        clearError('classSection');

        if (!validateYear(year)) {
            showError('year', 'Please select a valid year');
            isValid = false;
        } else {
            clearError('year');
        }

        if (!validateBranch(branch)) {
            showError('branch', 'Please enter a valid branch (minimum 2 characters)');
            isValid = false;
        } else {
            clearError('branch');
        }

        if (!validateCollegeEmail(collegeEmail)) {
            showError('collegeEmail', 'Please enter a valid college email ending with @miet.ac.in');
            isValid = false;
        } else {
            clearError('collegeEmail');
        }

        if (!joinGroup) {
            document.getElementById('joinGroupError').textContent = 'Please select an option';
            isValid = false;
        } else if (joinGroup !== 'yes') {
            document.getElementById('joinGroupError').textContent = 'You must select "Yes" to join the WhatsApp group to continue';
            isValid = false;
        } else {
            clearJoinGroupError();
        }

        if (!isValid) {
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        loadingMessage.style.display = 'block';
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';

        // Submit using the specified approach
        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            console.log('Success!', response);
            
            // Show success message
            loadingMessage.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Redirect after 3 seconds
            setTimeout(() => {
                window.location.href = WEBEX_REDIRECT_URL;
            }, 3000);
        })
        .catch(error => {
            console.error('Error!', error.message);
            loadingMessage.style.display = 'none';
            errorMessage.textContent = 'Submission failed. Please try again or contact support.';
            errorMessage.style.display = 'block';
            checkSubmitButton(); // Re-enable button based on group selection
        });
    });

    // Clear messages when user starts typing
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (successMessage.style.display === 'block' || errorMessage.style.display === 'block') {
                successMessage.style.display = 'none';
                errorMessage.style.display = 'none';
                errorMessage.textContent = '';
            }
        });
    });

    // Add debugging info for production
    if (window.location.hostname === 'csimiet.github.io') {
        console.log('Running on GitHub Pages');
        console.log('Script URL:', scriptURL);
    }
});