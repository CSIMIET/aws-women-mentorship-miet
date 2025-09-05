// Replace this URL with your Google Apps Script web app URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyZm_OINiHC1NmpTTcdrsMWXeRwmK93Zi1cKsFK9OPqYig9iZk4TiUp_6GjSym-0CnB/exec';

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
        // Optional field - return true if empty or if has valid content
        return classSection.trim().length === 0 || classSection.trim().length >= 2;
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

    function submitToGoogleSheets(formData) {
        return new Promise((resolve, reject) => {
            // Create a temporary form for submission
            const tempForm = document.createElement('form');
            tempForm.method = 'POST';
            tempForm.action = GOOGLE_SCRIPT_URL;
            tempForm.style.display = 'none';

            // Add form data as hidden inputs - match the field names expected by your Apps Script
            const fieldMapping = {
                'Name': formData.get('name'),
                'Roll Number': formData.get('rollNumber'), 
                'Section': formData.get('classSection') || '',
                'Year': formData.get('year'),
                'Branch': formData.get('branch'),
                'College Email': formData.get('collegeEmail'),
                'Join WhatsApp Group': formData.get('joinGroup')
            };

            Object.keys(fieldMapping).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = fieldMapping[key] || '';
                tempForm.appendChild(input);
            });

            // Create hidden iframe for submission
            const iframe = document.createElement('iframe');
            iframe.name = 'hidden_iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            tempForm.target = 'hidden_iframe';
            document.body.appendChild(tempForm);

            // Handle iframe load event
            iframe.onload = function() {
                // Clean up
                setTimeout(() => {
                    if (document.body.contains(tempForm)) {
                        document.body.removeChild(tempForm);
                    }
                    if (document.body.contains(iframe)) {
                        document.body.removeChild(iframe);
                    }
                }, 1000);
                resolve({ success: true });
            };

            // Handle iframe error
            iframe.onerror = function() {
                // Clean up
                if (document.body.contains(tempForm)) {
                    document.body.removeChild(tempForm);
                }
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
                reject(new Error('Submission failed'));
            };

            // Submit the form
            tempForm.submit();

            // Timeout after 5 seconds - assume success
            setTimeout(() => {
                if (document.body.contains(tempForm)) {
                    document.body.removeChild(tempForm);
                }
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
                resolve({ success: true }); // Assume success on timeout
            }, 5000);
        });
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
        if (!validateClassSection(classSection)) {
            showError('classSection', 'Please enter a valid section (minimum 2 characters)');
        } else {
            clearError('classSection');
        }
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

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
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

        if (!validateClassSection(classSection)) {
            showError('classSection', 'Please enter a valid section (minimum 2 characters)');
            isValid = false;
        } else {
            clearError('classSection');
        }

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

        try {
            // Submit to Google Sheets using form submission (bypasses CORS)
            await submitToGoogleSheets(formData);
            
            // Show success message
            loadingMessage.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = WEBEX_REDIRECT_URL;
            }, 2000);

        } catch (error) {
            console.error('Submission error:', error);
            loadingMessage.style.display = 'none';
            errorMessage.textContent = 'Submission failed. Please try again.';
            errorMessage.style.display = 'block';
            checkSubmitButton(); // Re-enable button based on group selection
        }
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
});