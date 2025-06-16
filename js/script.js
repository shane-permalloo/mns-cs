  // Modal JavaScript Functions
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // Close any other open modals first
        document.querySelectorAll('.afc-modal').forEach(m => {
            m.classList.remove('is-visible');
        });

        // Open the specified modal
        modal.classList.add('is-visible');
    }
  }

  function closeModal(closeButton) {
    const modal = closeButton 
        ? closeButton.closest('.afc-modal') 
        : document.querySelector('.afc-modal.is-visible');
    
    if (modal) {
        modal.classList.remove('is-visible');
    }
  }

  // Close modal when clicking outside the modal content
  document.addEventListener('click', function(event) {
    const visibleModal = document.querySelector('.afc-modal.is-visible');
    if (visibleModal && event.target === visibleModal) {
        closeModal();
    }
  });

  // Function to show an error message
  function showError(input, message, clearMsg = false) {
    clearError(input); // Remove existing error
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    input.classList.add("input-error");

    const formGroup = input.closest("div.form-group");
    if (formGroup) {
      formGroup.appendChild(errorDiv);
    } else {
      const trFormGroup = input.closest("tr.form-group");

      if (trFormGroup) {
        const tdLabel = trFormGroup.querySelector("td.form-label");
        if (tdLabel) {
          tdLabel.append(errorDiv);
        }
      }
    }

    // Remove error message after 3 seconds
    if (clearMsg) {
      setTimeout(() => {
        clearError(input);
      }, 3000);
    }
  }

  // Function to clear existing errors
  function clearError(input) {
    input.classList.remove("input-error");
    const error = input.closest(".form-group").querySelector(".error-message");
    if (error) {
      error.remove();
    }
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    const digitCount = phone.replace(/[^0-9]/g, "").length;
    return digitCount >= 7 && /^[0-9+\-()\s]+$/.test(phone);
  }

  function resetForm(formElement) {
    // Clear all error messages and value on form
    const fields = formElement.querySelectorAll("input:not(#date), select, textarea");
    fields.forEach((field) => {
      field.value = "";
      clearError(field);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Select all input and textarea fields
    const formFields = document.querySelectorAll("input:not(.email):not(.telephone), select, textarea");
    const telephoneFields = document.querySelectorAll(".telephone");

    formFields.forEach((input) => {
      input.addEventListener("input", function (event) {
        // Allow letters, numbers, spaces, and specified special characters
        this.value = this.value.replace(/[^a-zA-Z0-9\s&@_\-:;?!().,]/g, "");

        // Optional: Show an error message if an invalid character was entered
        if (event.inputType === "insertText" && /[^a-zA-Z0-9\s&@_\-:;?!().,]/.test(event.data)) {
          showError(this, "Only letters, numbers, &, @, _, -, :, ;, ?, !, (, ), ., and , are allowed.", true);
        }
      });
    });

    telephoneFields.forEach((input) => {
      input.addEventListener("input", function (event) {
        // Allow numbers, spaces, and specified special characters
        this.value = this.value.replace(/[^0-9+\s\-()]/g, "");

        // Optional: Show an error message if an invalid character was entered
        if (event.inputType === "insertText" && /[^0-9+\s\-()]/.test(event.data)) {
          showError(this, "Only numbers, -, +, (, ) are allowed.", true);
        }
      });
    });

    formFields.forEach((field) => {
      if (!field.closest(".form-group")) {
        const wrapper = document.createElement("div");
        wrapper.className = "form-group";
        field.parentElement.insertBefore(wrapper, field);
        wrapper.appendChild(field);
      }
    });

    // Add required-field class to labels of required fields
    document.querySelectorAll("input[required], select[required], textarea[required]").forEach((field) => {
      const label = field.parentElement.querySelector("label");
      if (label) {
        label.classList.add("required-field");
      }
    });

    const form = document.querySelector("form#userForm");
    const clearBtn = document.querySelector("#clearBtn");
    const submitBtn = document.getElementById("submitBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", function (e) {
        e.preventDefault();
        resetForm(form);
      });
    }
    if (submitBtn) {
      submitBtn.addEventListener("click", function (e) {
        e.preventDefault();
        let isValid = true;

        // Clear all previous errors first
        document.querySelectorAll(".error-message").forEach((error) => error.remove());
        document.querySelectorAll(".input-error").forEach((field) => field.classList.remove("input-error"));

        const telephoneInput = document.querySelectorAll(".telephone[required]");
        if (telephoneInput) {
          telephoneInput.forEach((input) => {
            if (input.value && !validatePhone(input.value)) {
              clearError(input);
              showError(input, "Please enter a valid phone number");
              isValid = false;
            }
          });
        }

        const emailInput = document.querySelectorAll(".email[required]");
        if (emailInput) {
          emailInput.forEach((input) => {
            if (input.value && !validateEmail(input.value)) {
              clearError(input);
              showError(input, "Please enter a valid email address");
              isValid = false;
            }
          });
        }

        const privacyCheckbox = document.querySelector("#ack");
        if (privacyCheckbox) {
          if (!privacyCheckbox.checked) {
            showError(privacyCheckbox, "You must acknowledge the Privacy Notice");
            isValid = false;
          }
        }

        document.querySelectorAll("input[type=radio][required]").forEach((radio) => {
          const radioGroup = document.querySelectorAll(`input[name="${radio.name}"]`);

          let isValid = false;
          for (const input of radioGroup) {
            clearError(input);
            if (input.checked) {
              isValid = true;
              break;
            }
          }

          if (!isValid) {
            showError(radioGroup[0], "This field is mandatory");
          }
        });

        document.querySelectorAll("input:not(#ack)[type=checkbox][required]").forEach((checkbox) => {
          const checkboxGroup = document.querySelectorAll(`input[name="${checkbox.name}"]`);

          let isValid = false;
          for (const input of checkboxGroup) {
            clearError(input);
            if (input.checked) {
              isValid = true;
              break;
            }
          }

          if (!isValid) {
            showError(checkboxGroup[0], "This field is mandatory");
          }
        });

        const fieldInputs = document.querySelectorAll("select[required], input[required], textarea[required]");
        if (fieldInputs) {
          fieldInputs.forEach((input) => {
            if (input.value.trim() === "") {
              showError(input, "This field is mandatory");
              isValid = false;
            }
          });
        }

        // File validation
        const fileInputs = document.querySelectorAll('input[type="file"]');
        if (fileInputs) {
          fileInputs.forEach((input) => {
            if (input.hasAttribute("required") && !input.files.length) {
              clearError(input);
              showError(input, "Please upload a file");
              isValid = false;
            } else if (input.files.length > 0) {
              const file = input.files[0];
              if (file.size > 1 * 1024 * 1024) {
                clearError(input);
                showError(input, "File size should not exceed 1MB");
                isValid = false;
              }
            }
          });
        }

        if (isValid) {
          // Simulate form submission to bind the backend to it once ready
          const submitButton = document.querySelector("#submitBtn");
          submitButton.disabled = true;
          submitButton.textContent = "Submitting...";

          setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = "Submit";
            openModal("successModal");
            form.reset();
            // Clear all validation states
            document.querySelectorAll(".error-message").forEach((error) => error.remove());
            document.querySelectorAll(".input-error").forEach((field) => field.classList.remove("input-error"));
          }, 2000);
        }
      });
    }
  });

  // Real-time validation for email fields
  const email = document.querySelectorAll('input[type="email"]');
  if (email) {
    email.forEach((input) => {
      input.addEventListener("blur", function () {
        if (this.value && !validateEmail(this.value)) {
          showError(this, "Please enter a valid email address");
        } else {
          clearError(this);
        }
      });
    });
  }

  // Real-time validation for phone number
  const telephone = document.querySelectorAll(".telephone");
  if (telephone) {
    telephone.forEach((input) => {
      input.addEventListener("blur", function () {
        if (this.value && !validatePhone(this.value)) {
          showError(this, "Please enter a valid phone number");
        } else {
          clearError(this);
        }
      });
    });
  }

  // Real-time validation for required inputs
  document.querySelectorAll("input[required]").forEach((input) => {
    input.addEventListener("change", function (e) {
      if (this.value != "") {
        clearError(this);
      } else {
        showError(this, "This field is mandatory");
      }
    });
  });

  // Real-time validation for radio inputs
  document.querySelectorAll("input[type=radio], input[type=checkbox]").forEach((radio) => {
    radio.addEventListener("change", function () {
      const radioGroup = document.querySelectorAll(`input[name="${radio.name}"]`);

      const isRequired = Array.from(radioGroup).some((radio) => radio.hasAttribute("required"));
      if (!isRequired) return;
      let isValid = false;
      clearError(radio);

      for (const input of radioGroup) {
        if (input.checked) {
          isValid = true;
          clearError(input);
          break; // Stop checking if one is selected
        }
      }

      // Show error only if no radio is selected
      if (!isValid) {
        showError(radioGroup[0], "This field is mandatory"); // Show error on the first radio input
      }
    });
  });

  // File upload preview
  document.querySelectorAll('input[type="file"]').forEach((input) => {
    input.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 1 * 1024 * 1024) {
          showError(this, "File size should not exceed 1MB");
          this.value = ""; // Clear the file input
        } else {
          clearError(this);
          const label = e.target.nextElementSibling;
          label.textContent = file.name;
        }
      }
    });
  });

  // Set default date
  const datetime = document.querySelector('input[type="datetime-local"]');
  if (datetime) {
    datetime.value = new Date().toISOString().slice(0, 16);
  }

  // Feedback form
  const recommendYes = document.getElementById("recommend-yes");
  const recommendNo = document.getElementById("recommend-no");
  const noReasonContainer = document.getElementById("no-reason-container");
  const noReasonTextarea = document.getElementById("no-reason");

  // Function to handle the radio button change
  function handleRecommendChange() {
    if (recommendNo.checked) {
      // If "No" is selected, show the reason container
      noReasonContainer.style.display = "table-row";
      // Make the textarea required
      noReasonTextarea.setAttribute("required", "required");
    } else {
      // If "Yes" is selected, hide the reason container
      noReasonContainer.style.display = "none";
      // Remove the required attribute
      noReasonTextarea.removeAttribute("required");
      // Clear any existing content
      noReasonTextarea.value = "";
    }
  }

  // Add event listeners to both radio buttons
  if (recommendYes) {
    recommendYes.addEventListener("change", handleRecommendChange);
  }
  if (recommendNo) {
    recommendNo.addEventListener("change", handleRecommendChange);
  }
  // Initial check in case a radio button is pre-selected
  document.addEventListener("DOMContentLoaded", function () {
    if (recommendNo && recommendYes) {
      handleRecommendChange();
    }
  });
