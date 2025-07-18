/**
 * ArcVantage Design Studios - Contact Form JavaScript
 * Enhanced form validation and submission handling for the contact form
 * Includes real-time validation, accessibility features, and animated feedback
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get the contact form element
    const contactForm = document.getElementById('contactForm');
    
    // Form fields object
    const formFields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        projectType: document.getElementById('projectType'),
        message: document.getElementById('message'),
        privacy: document.getElementById('privacy')
    };
    
    // Form validation messages container
    const formMessages = document.createElement('div');
    formMessages.className = 'form-messages';
    formMessages.setAttribute('aria-live', 'polite'); // Accessibility: announce changes
    
    // Insert the messages container after the form
    if (contactForm) {
        contactForm.parentNode.insertBefore(formMessages, contactForm.nextSibling);
    }
    
    // Create confirmation overlay
    const confirmationOverlay = createConfirmationOverlay();
    document.body.appendChild(confirmationOverlay);
    
    // Initialize form field event listeners
    initializeFormValidation();
    
    /**
     * Initialize form validation event listeners
     */
    function initializeFormValidation() {
        // Name field validation
        if (formFields.name) {
            formFields.name.addEventListener('blur', function() {
                validateField(this, isNotEmpty, 'Please enter your name');
            });
            
            // Real-time validation as user types (with debounce)
            formFields.name.addEventListener('input', debounce(function() {
                if (this.value.trim().length > 2) {
                    validateField(this, isNotEmpty, 'Please enter your name');
                }
            }, 500));
        }
        
        // Email field validation
        if (formFields.email) {
            formFields.email.addEventListener('blur', function() {
                validateField(this, isValidEmail, 'Please enter a valid email address');
            });
            
            // Real-time validation as user types (with debounce)
            formFields.email.addEventListener('input', debounce(function() {
                if (this.value.trim().includes('@')) {
                    validateField(this, isValidEmail, 'Please enter a valid email address');
                }
            }, 500));
        }
        
        // Phone field validation (optional)
        if (formFields.phone) {
            formFields.phone.addEventListener('blur', function() {
                // Phone is optional, only validate if not empty
                if (this.value.trim() !== '') {
                    validateField(this, isValidPhone, 'Please enter a valid phone number');
                } else {
                    removeFieldError(this);
                }
            });
            
            // Format phone number as user types
            formFields.phone.addEventListener('input', function() {
                formatPhoneNumber(this);
            });
        }
        
        // Project type validation
        if (formFields.projectType) {
            formFields.projectType.addEventListener('change', function() {
                validateField(this, isNotEmpty, 'Please select a project type');
            });
        }
        
        // Message field validation
        if (formFields.message) {
            formFields.message.addEventListener('blur', function() {
                validateField(this, isNotEmpty, 'Please enter your message');
            });
            
            // Character counter for message field
            formFields.message.addEventListener('input', function() {
                updateCharacterCount(this);
            });
            
            // Initialize character counter
            createCharacterCounter(formFields.message);
        }
        
        // Privacy checkbox validation
        if (formFields.privacy) {
            formFields.privacy.addEventListener('change', function() {
                validateField(this, isChecked, 'You must agree to the privacy policy');
            });
        }
        
        // Form submission handler
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }
        
        // Add field highlighting on focus
        Object.values(formFields).forEach(field => {
            if (field) {
                field.addEventListener('focus', function() {
                    this.classList.add('focused');
                });
                
                field.addEventListener('blur', function() {
                    this.classList.remove('focused');
                });
            }
        });
    }
    
    /**
     * Create confirmation overlay for successful form submission
     * @returns {HTMLElement} - Confirmation overlay element
     */
    function createConfirmationOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'confirmation-overlay';
        overlay.style.display = 'none';
        
        const content = document.createElement('div');
        content.className = 'confirmation-content';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'confirmation-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close confirmation message');
        closeBtn.addEventListener('click', function() {
            overlay.style.display = 'none';
            document.body.classList.remove('overlay-active');
        });
        
        content.appendChild(closeBtn);
        overlay.appendChild(content);
        
        return overlay;
    }
    
    /**
     * Show confirmation overlay with personalized message
     * @param {Object} formData - Form data object
     */
    function showConfirmationOverlay(formData) {
        const overlay = document.querySelector('.confirmation-overlay');
        const content = overlay.querySelector('.confirmation-content');
        
        // Create confirmation content
        content.innerHTML = '';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'confirmation-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close confirmation message');
        closeBtn.addEventListener('click', function() {
            overlay.style.display = 'none';
            document.body.classList.remove('overlay-active');
        });
        
        const icon = document.createElement('div');
        icon.className = 'confirmation-icon';
        icon.innerHTML = '<i class="fas fa-check-circle"></i>';
        
        const title = document.createElement('h3');
        title.textContent = 'Thank You!';
        
        const message = document.createElement('p');
        message.textContent = `Thank you, ${formData.name.split(' ')[0]}! Your message has been sent successfully. Our team will contact you soon about your ${formData.projectType} project.`;
        
        const details = document.createElement('div');
        details.className = 'confirmation-details';
        details.innerHTML = `
            <h4>Message Details:</h4>
            <ul>
                <li><strong>Name:</strong> ${formData.name}</li>
                <li><strong>Email:</strong> ${formData.email}</li>
                ${formData.phone ? `<li><strong>Phone:</strong> ${formData.phone}</li>` : ''}
                <li><strong>Project Type:</strong> ${formData.projectType}</li>
            </ul>
        `;
        
        const nextSteps = document.createElement('div');
        nextSteps.className = 'confirmation-next-steps';
        nextSteps.innerHTML = `
            <h4>What's Next?</h4>
            <p>Our team will review your inquiry and get back to you within 1-2 business days. In the meantime, feel free to explore our projects and blog for inspiration.</p>
            <div class="confirmation-links">
                <a href="#projects" class="btn btn-outline">View Projects</a>
                <a href="#blog" class="btn btn-outline">Read Our Blog</a>
            </div>
        `;
        
        // Add all elements to content
        content.appendChild(closeBtn);
        content.appendChild(icon);
        content.appendChild(title);
        content.appendChild(message);
        content.appendChild(details);
        content.appendChild(nextSteps);
        
        // Show overlay
        overlay.style.display = 'flex';
        document.body.classList.add('overlay-active');
        
        // Add event listeners to close overlay
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.style.display = 'none';
                document.body.classList.remove('overlay-active');
            }
        });
        
        // Close overlay when ESC key is pressed
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay.style.display === 'flex') {
                overlay.style.display = 'none';
                document.body.classList.remove('overlay-active');
            }
        });
        
        // Add click event to confirmation links
        const links = overlay.querySelectorAll('.confirmation-links a');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                overlay.style.display = 'none';
                document.body.classList.remove('overlay-active');
            });
        });
    }
    
    /**
     * Handle form submission
     * @param {Event} e - Form submission event
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate all required fields
        let isValid = true;
        
        isValid = validateField(formFields.name, isNotEmpty, 'Please enter your name') && isValid;
        isValid = validateField(formFields.email, isValidEmail, 'Please enter a valid email address') && isValid;
        
        // Phone is optional, only validate if not empty
        if (formFields.phone && formFields.phone.value.trim() !== '') {
            isValid = validateField(formFields.phone, isValidPhone, 'Please enter a valid phone number') && isValid;
        }
        
        isValid = validateField(formFields.projectType, isNotEmpty, 'Please select a project type') && isValid;
        isValid = validateField(formFields.message, isNotEmpty, 'Please enter your message') && isValid;
        isValid = validateField(formFields.privacy, isChecked, 'You must agree to the privacy policy') && isValid;
        
        if (isValid) {
            // Show loading state
            const submitButton = contactForm.querySelector('.submit-btn');
            if (submitButton) {
                submitButton.disabled = true;
                const originalContent = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                // Simulate form submission (in a real application, this would be an AJAX request)
                setTimeout(function() {
                    // Collect form data for demonstration
                    const formData = {
                        name: formFields.name.value,
                        email: formFields.email.value,
                        phone: formFields.phone.value,
                        projectType: formFields.projectType.value,
                        message: formFields.message.value
                    };
                    
                    console.log('Form submitted with data:', formData);
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Clear any character counters
                    const charCounter = document.querySelector('.character-counter');
                    if (charCounter) {
                        charCounter.textContent = '0/500 characters';
                    }
                    
                    // Show success message with personalized content
                    showFormMessage(
                        'success', 
                        `Thank you, ${formData.name.split(' ')[0]}! Your message has been sent successfully.`
                    );
                    
                    // Show confirmation overlay
                    showConfirmationOverlay(formData);
                    
                    // Reset button state
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalContent;
                    }
                    
                    // Clear success message after 8 seconds
                    setTimeout(function() {
                        clearFormMessages();
                    }, 8000);
                }, 1500);
            }
        } else {
            // Show error message
            showFormMessage('error', 'Please correct the errors in the form before submitting.');
            
            // Focus on the first field with an error
            const firstErrorField = document.querySelector('.error');
            if (firstErrorField) {
                firstErrorField.focus();
            }
        }
    }
    
    /**
     * Create character counter for textarea
     * @param {HTMLElement} field - Textarea element
     */
    function createCharacterCounter(field) {
        if (!field) return;
        
        const maxLength = 500; // Set maximum character length
        field.setAttribute('maxlength', maxLength);
        
        // Create counter element
        const counterElement = document.createElement('div');
        counterElement.className = 'character-counter';
        counterElement.textContent = `0/${maxLength} characters`;
        
        // Insert counter after textarea
        field.parentNode.insertBefore(counterElement, field.nextSibling);
    }
    
    /**
     * Update character counter for textarea
     * @param {HTMLElement} field - Textarea element
     */
    function updateCharacterCount(field) {
        if (!field) return;
        
        const maxLength = parseInt(field.getAttribute('maxlength')) || 500;
        const currentLength = field.value.length;
        const counterElement = field.parentNode.querySelector('.character-counter');
        
        if (counterElement) {
            counterElement.textContent = `${currentLength}/${maxLength} characters`;
            
            // Add warning class if approaching limit
            if (currentLength > maxLength * 0.8) {
                counterElement.classList.add('warning');
            } else {
                counterElement.classList.remove('warning');
            }
        }
    }
    
    /**
     * Format phone number as user types
     * @param {HTMLElement} field - Phone input field
     */
    function formatPhoneNumber(field) {
        if (!field) return;
        
        // Get input value and remove non-numeric characters
        let input = field.value.replace(/\D/g, '');
        
        // Format the phone number as (XXX) XXX-XXXX
        if (input.length > 0) {
            if (input.length <= 3) {
                field.value = input;
            } else if (input.length <= 6) {
                field.value = `(${input.slice(0, 3)}) ${input.slice(3)}`;
            } else {
                field.value = `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(6, 10)}`;
            }
        }
    }
    
    // Validation functions
    
    /**
     * Check if value is not empty
     * @param {string} value - Field value
     * @returns {boolean} - True if not empty
     */
    function isNotEmpty(value) {
        return value.trim() !== '';
    }
    
    /**
     * Check if checkbox is checked
     * @param {boolean} value - Checkbox checked state
     * @returns {boolean} - True if checked
     */
    function isChecked(value) {
        return value === true;
    }
    
    /**
     * Validate email format
     * @param {string} value - Email value
     * @returns {boolean} - True if valid email
     */
    function isValidEmail(value) {
        // More comprehensive email validation
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(value.trim());
    }
    
    /**
     * Validate phone number format
     * @param {string} value - Phone number value
     * @returns {boolean} - True if valid phone number
     */
    function isValidPhone(value) {
        // Allow various phone formats but ensure it has enough digits
        const phoneRegex = /^[\d\s\-\(\)\.+]+$/;
        const digitsOnly = value.replace(/\D/g, '');
        return phoneRegex.test(value) && digitsOnly.length >= 10 && digitsOnly.length <= 15;
    }
    
    /**
     * Field validation helper
     * @param {HTMLElement} field - Form field element
     * @param {Function} validationFn - Validation function
     * @param {string} errorMessage - Error message to display
     * @returns {boolean} - True if field is valid
     */
    function validateField(field, validationFn, errorMessage) {
        if (!field) return true;
        
        // For checkboxes, use checked property; for other inputs, use value
        const fieldValue = field.type === 'checkbox' ? field.checked : field.value;
        const isValid = validationFn(fieldValue);
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        } else {
            removeFieldError(field);
        }
        
        return isValid;
    }
    
    /**
     * Show field error
     * @param {HTMLElement} field - Form field element
     * @param {string} message - Error message
     */
    function showFieldError(field, message) {
        // Remove any existing error
        removeFieldError(field);
        
        // Add error class to field
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true'); // Accessibility
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.id = `${field.id}-error`;
        
        // Link the error message to the field for accessibility
        field.setAttribute('aria-describedby', errorElement.id);
        
        // Insert error message after the field
        if (field.type === 'checkbox') {
            // For checkboxes, insert after the label
            const parentElement = field.parentNode;
            parentElement.insertBefore(errorElement, parentElement.nextSibling);
        } else {
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
        
        // Add shake animation to the field for visual feedback
        field.classList.add('shake');
        setTimeout(() => {
            field.classList.remove('shake');
        }, 500);
    }
    
    /**
     * Remove field error
     * @param {HTMLElement} field - Form field element
     */
    function removeFieldError(field) {
        // Remove error class and attributes
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
        
        // Find and remove error message
        let errorElement;
        
        if (field.type === 'checkbox') {
            // For checkboxes, look for error after the parent element
            const parentElement = field.parentNode;
            errorElement = parentElement.nextElementSibling;
            if (errorElement && errorElement.classList.contains('field-error')) {
                errorElement.parentNode.removeChild(errorElement);
            }
        } else {
            // For other inputs, look for error after the field
            errorElement = field.nextElementSibling;
            if (errorElement && errorElement.classList.contains('field-error')) {
                errorElement.parentNode.removeChild(errorElement);
            }
        }
    }
    
    /**
     * Show form message (success or error)
     * @param {string} type - Message type ('success' or 'error')
     * @param {string} message - Message content
     */
    function showFormMessage(type, message) {
        // Clear any existing messages
        clearFormMessages();
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.setAttribute('role', 'alert'); // Accessibility
        messageElement.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'message-close';
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'Close message');
        closeButton.addEventListener('click', function() {
            formMessages.removeChild(messageElement);
        });
        
        messageElement.appendChild(closeButton);
        
        // Add to messages container
        formMessages.appendChild(messageElement);
        
        // Scroll to message with smooth animation
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    /**
     * Clear all form messages
     */
    function clearFormMessages() {
        formMessages.innerHTML = '';
    }
    
    /**
     * Debounce function to limit how often a function is called
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} - Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    
    // Add CSS for animations and form styling
    const style = document.createElement('style');
    style.textContent = `
        /* Shake animation for error fields */
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.5s ease-in-out;
        }
        
        /* Character counter styles */
        .character-counter {
            font-size: 0.8rem;
            color: #718096;
            text-align: right;
            margin-top: 4px;
        }
        
        .character-counter.warning {
            color: #d69e2e;
            font-weight: bold;
        }
        
        /* Field error styles */
        .field-error {
            color: var(--error);
            font-size: 0.8rem;
            margin-top: 4px;
            display: flex;
            align-items: center;
        }
        
        .field-error::before {
            content: '⚠️';
            margin-right: 5px;
        }
        
        /* Form message styles */
        .form-message {
            padding: 15px;
            border-radius: var(--radius-md);
            margin-top: 20px;
            display: flex;
            align-items: center;
            position: relative;
        }
        
        .form-message.success {
            background-color: rgba(56, 161, 105, 0.1);
            border-left: 4px solid var(--success);
            color: var(--success);
        }
        
        .form-message.error {
            background-color: rgba(229, 62, 62, 0.1);
            border-left: 4px solid var(--error);
            color: var(--error);
        }
        
        .form-message i {
            font-size: 1.5rem;
            margin-right: 10px;
        }
        
        .message-close {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: inherit;
            opacity: 0.7;
        }
        
        .message-close:hover {
            opacity: 1;
        }
        
        /* Form field focus styles */
        .form-group input.focused,
        .form-group select.focused,
        .form-group textarea.focused {
            border-color: var(--accent-color);
            box-shadow: 0 0 0 3px rgba(56, 178, 172, 0.2);
        }
        
        /* Confirmation overlay styles */
        .confirmation-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: var(--z-overlay);
        }
        
        .confirmation-content {
            background-color: var(--white);
            border-radius: var(--radius-md);
            padding: 30px;
            max-width: 500px;
            width: 90%;
            position: relative;
            text-align: center;
            box-shadow: var(--shadow-xl);
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .confirmation-close {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-light);
        }
        
        .confirmation-icon {
            font-size: 3rem;
            color: var(--success);
            margin-bottom: 20px;
        }
        
        .confirmation-details {
            margin: 20px 0;
            text-align: left;
            background-color: var(--neutral-color);
            padding: 15px;
            border-radius: var(--radius-md);
        }
        
        .confirmation-details ul {
            list-style: none;
            padding: 0;
        }
        
        .confirmation-details li {
            margin-bottom: 5px;
        }
        
        .confirmation-next-steps {
            margin-top: 20px;
            text-align: left;
        }
        
        .confirmation-links {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
        }
        
        body.overlay-active {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
});