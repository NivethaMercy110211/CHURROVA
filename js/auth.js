(() => {
  const forms = document.querySelectorAll('[data-auth-form]');

  document.querySelectorAll('[data-password-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.passwordToggle);
      if (!input) return;
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      button.textContent = showing ? 'Show' : 'Hide';
      button.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    });
  });

  forms.forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(input => {
        const group = input.closest('.form-group');
        const matchesPassword = input.id !== 'confirm-password' || input.value === document.getElementById('signup-password')?.value;
        const fieldValid = input.checkValidity() && matchesPassword;
        group?.classList.toggle('has-error', !fieldValid);
        input.classList.toggle('error', !fieldValid);
        input.classList.toggle('success', fieldValid);
        valid = valid && fieldValid;
      });
      if (!valid) return;
      const message = form.querySelector('.auth-message');
      message?.classList.add('show');
      form.reset();
      form.querySelectorAll('.form-control').forEach(input => input.classList.remove('success'));
    });
  });
})();
