// cypress/e2e/01-auth.cy.js — SC-047: Authentication flow tests

describe('SC-047 | Authentication', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('shows login page with email and password fields', () => {
    cy.get('#login-email, input[type="email"]').first().should('be.visible');
    cy.get('#login-password, input[type="password"]').first().should('be.visible');
    cy.get('#login-btn, button[type="submit"], .btn-primary').first().should('be.visible');
  });

  it('shows error on invalid credentials', () => {
    cy.get('#login-email, input[type="email"]').first().type('wrong@test.com');
    cy.get('#login-password, input[type="password"]').first().type('wrongpassword');
    cy.get('#login-btn, button[type="submit"], .btn-primary').first().click();
    cy.get('#toast, .toast, [class*="toast"], [class*="error"]', { timeout: 8000 })
      .should('be.visible');
  });

  it('redirects to dashboard after successful login', () => {
    cy.get('#login-email, input[type="email"]').first().type(Cypress.env('ADMIN_EMAIL'));
    cy.get('#login-password, input[type="password"]').first().type(Cypress.env('ADMIN_PASSWORD'));
    cy.get('#login-btn, button[type="submit"], .btn-primary').first().click();
    cy.url({ timeout: 15000 }).should('not.include', 'login.html');
  });

  it('persists session on page reload', () => {
    cy.loginAs('admin');
    cy.reload();
    cy.url().should('not.include', 'login.html');
  });

  it('sign out clears session and redirects to login', () => {
    cy.loginAs('admin');
    cy.contains(/sign out/i).click();
    cy.url({ timeout: 8000 }).should('include', 'login');
  });
});
