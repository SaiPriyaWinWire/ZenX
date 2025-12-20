(function () {
  if (typeof window === 'undefined') {
    return;
  }

  const roleCards = Array.from(document.querySelectorAll('[data-role-card]'));
  if (!roleCards.length) {
    return;
  }

  let activeRole = roleCards.find((card) => card.classList.contains('is-active'))?.dataset.roleCard || 'reviewer';

  const updateActiveRole = (nextRole) => {
    activeRole = nextRole;
    roleCards.forEach((card) => {
      const isCurrent = card.dataset.roleCard === activeRole;
      card.classList.toggle('is-active', isCurrent);
      card.setAttribute('aria-pressed', String(isCurrent));
    });
  };

  const redirectForRole = (role) => {
    const destination = new URL('/auth/azure/start', window.location.origin);
    destination.searchParams.set('role', role);
    window.location.assign(destination.toString());
  };

  roleCards.forEach((card) => {
    card.addEventListener('click', () => {
      const selectedRole = card.dataset.roleCard || 'reviewer';
      updateActiveRole(selectedRole);
      redirectForRole(selectedRole);
    });
  });
})();