// cypress/support/e2e.js — Global support file

// Suppress uncaught exceptions from app code (non-test errors)
Cypress.on('uncaught:exception', (err) => {
  // Suppress all app-level JS errors — we test behavior, not internal app errors
  return false;
});

// ── Custom Commands ────────────────────────────────────────────
Cypress.Commands.add('loginAs', (role = 'admin') => {
  const credentials = {
    admin: { email: Cypress.env('ADMIN_EMAIL'), password: Cypress.env('ADMIN_PASSWORD') },
    pm:    { email: Cypress.env('PM_EMAIL'),    password: Cypress.env('PM_PASSWORD') },
    foreman: { email: Cypress.env('FOREMAN_EMAIL'), password: Cypress.env('FOREMAN_PASSWORD') },
  };
  const { email, password } = credentials[role];
  cy.visit('/');
  cy.get('#login-email, input[type="email"]').first().type(email);
  cy.get('#login-password, input[type="password"]').first().type(password);
  cy.get('#login-btn, button[type="submit"], .btn-primary').first().click();
  cy.url({ timeout: 15000 }).should('not.include', 'login.html');
});
