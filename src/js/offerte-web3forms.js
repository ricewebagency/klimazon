(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const result = document.getElementById("result");
    const modal = document.getElementById("success-modal");
    const modalClose = document.getElementById("modal-close");
    const modalBackdrop = document.getElementById("modal-backdrop");

    if (!form || !result) return;

    function openModal() {
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      modalClose.focus();
    }

    function closeModal() {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    }

    modalClose.addEventListener("click", closeModal);
    modalBackdrop.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validate service selection
      const serviceCheckboxes = form.querySelectorAll("[data-service]");
      const servicesError = document.getElementById("services-error");
      const dienstenHidden = document.getElementById("diensten-hidden");
      const selected = [...serviceCheckboxes].filter((cb) => cb.checked).map((cb) => cb.value);

      if (selected.length === 0) {
        servicesError.classList.remove("hidden");
        servicesError.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      servicesError.classList.add("hidden");
      dienstenHidden.value = selected.join(", ");

      const submitBtn = form.querySelector('[type="submit"]');
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : null;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin inline-block mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          Bezig met verzenden…
        `;
      }

      result.textContent = "";

      try {
        const formData = new FormData(form);
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          form.reset();
          openModal();
        } else {
          result.textContent = data.message || "Er is iets misgegaan. Probeer het opnieuw.";
        }
      } catch {
        result.textContent = "Er is een fout opgetreden. Controleer uw internetverbinding en probeer het opnieuw.";
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
      }
    });
  });
})();