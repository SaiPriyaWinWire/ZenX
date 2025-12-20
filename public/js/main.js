window.addEventListener('DOMContentLoaded', () => {
  const alerts = document.querySelectorAll('.alert');
  if (!alerts.length) {
    return;
  }

  setTimeout(() => {
    alerts.forEach((alert) => {
      alert.classList.add('alert--closing');
      alert.addEventListener('transitionend', () => alert.remove(), { once: true });
    });
  }, 4500);
});
