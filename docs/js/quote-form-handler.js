/**
 * Offerte Formulier Handler
 * Verwerkt contactformulier voor offerteaanvragen via Web3Forms API
 */

(function initializeQuoteForm() {
  'use strict';

  // Wacht tot DOM volledig geladen is
  document.addEventListener('DOMContentLoaded', function() {
    // Formulier elementen ophalen
    const contactForm = document.getElementById('contact-form');
    const feedbackElement = document.getElementById('result');
    const successModal = document.getElementById('success-modal');
    const closeButton = document.getElementById('modal-close');
    const backdrop = document.getElementById('modal-backdrop');

    // Controleer of essentiële elementen bestaan
    if (!contactForm || !feedbackElement) {
      console.warn('Formulier elementen niet gevonden');
      return;
    }

    /**
     * Toont de success modal
     */
    function showSuccessModal() {
      if (!successModal) return;
      
      successModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      
      if (closeButton) {
        closeButton.focus();
      }
    }

    /**
     * Sluit de success modal
     */
    function hideSuccessModal() {
      if (!successModal) return;
      
      successModal.classList.add('hidden');
      document.body.style.overflow = '';
    }

    /**
     * Valideert de geselecteerde diensten
     * @returns {Object} Validatie resultaat met status en geselecteerde diensten
     */
    function validateServiceSelection() {
      const serviceCheckboxes = contactForm.querySelectorAll('[data-service]');
      const errorMessage = document.getElementById('services-error');
      const hiddenField = document.getElementById('diensten-hidden');

      // Verzamel geselecteerde diensten
      const selectedServices = Array.from(serviceCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

      // Controleer of er minimaal één dienst is geselecteerd
      if (selectedServices.length === 0) {
        if (errorMessage) {
          errorMessage.classList.remove('hidden');
          errorMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
        return { isValid: false, services: [] };
      }

      // Verberg foutmelding en update hidden field
      if (errorMessage) {
        errorMessage.classList.add('hidden');
      }
      
      if (hiddenField) {
        hiddenField.value = selectedServices.join(', ');
      }

      return { isValid: true, services: selectedServices };
    }

    /**
     * Update submit button status
     * @param {HTMLElement} button - Submit button
     * @param {boolean} isLoading - Loading state
     */
    function updateSubmitButton(button, isLoading) {
      if (!button) return;

      button.disabled = isLoading;

      if (isLoading) {
        button.dataset.originalContent = button.innerHTML;
        button.innerHTML = `
          <svg class="animate-spin inline-block mr-2 h-4 w-4 text-white" 
               xmlns="http://www.w3.org/2000/svg" 
               fill="none" 
               viewBox="0 0 24 24" 
               aria-hidden="true">
            <circle class="opacity-25" cx="12" cy="12" r="10" 
                    stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" 
                  d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          Bezig met verzenden…
        `;
      } else {
        button.innerHTML = button.dataset.originalContent || 'Verzenden';
        delete button.dataset.originalContent;
      }
    }

    /**
     * Verstuurt formulier data naar Web3Forms
     * @param {FormData} formData - De formulier data
     * @returns {Promise<Object>} Response van de API
     */
    async function submitFormData(formData) {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Netwerkfout bij verzenden formulier');
      }

      return await response.json();
    }

    /**
     * Toont feedback bericht aan gebruiker
     * @param {string} message - Het te tonen bericht
     * @param {boolean} isError - Of het een foutmelding is
     */
    function displayFeedback(message, isError = false) {
      if (!feedbackElement) return;
      
      feedbackElement.textContent = message;
      feedbackElement.className = isError 
        ? 'text-red-600 mt-4' 
        : 'text-green-600 mt-4';
    }

    /**
     * Verwerkt het formulier submit event
     * @param {Event} event - Submit event
     */
    async function handleFormSubmit(event) {
      event.preventDefault();

      // Reset feedback
      feedbackElement.textContent = '';

      // Valideer diensten selectie
      const validation = validateServiceSelection();
      if (!validation.isValid) {
        return;
      }

      // Haal submit button op
      const submitButton = contactForm.querySelector('[type="submit"]');
      
      try {
        // Toon loading state
        updateSubmitButton(submitButton, true);

        // Verstuur formulier data
        const formData = new FormData(contactForm);
        const responseData = await submitFormData(formData);

        // Verwerk response
        if (responseData.success) {
          contactForm.reset();
          // Redirect naar bedankt pagina
          window.location.href = 'bedankt.html';
        } else {
          const errorMsg = responseData.message || 
            'Er is iets misgegaan. Probeer het opnieuw.';
          displayFeedback(errorMsg, true);
        }

      } catch (error) {
        console.error('Formulier verzenden mislukt:', error);
        displayFeedback(
          'Er is een fout opgetreden. Controleer uw internetverbinding en probeer het opnieuw.',
          true
        );
      } finally {
        // Reset button state
        updateSubmitButton(submitButton, false);
      }
    }

    // Event listeners registreren
    contactForm.addEventListener('submit', handleFormSubmit);

    if (closeButton) {
      closeButton.addEventListener('click', hideSuccessModal);
    }

    if (backdrop) {
      backdrop.addEventListener('click', hideSuccessModal);
    }

    // Escape key voor modal sluiten
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && 
          successModal && 
          !successModal.classList.contains('hidden')) {
        hideSuccessModal();
      }
    });
  });

})();
