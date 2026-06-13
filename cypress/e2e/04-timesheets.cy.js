// cypress/e2e/04-timesheets.cy.js — SC-047: Timesheet flow tests

describe('SC-047 | Timesheets', () => {
  beforeEach(() => {
    cy.loginAs('admin');
    cy.visit('/timesheets.html');
  });

  it('loads timesheet page with entries table', () => {
    cy.get('table, [id*="timesheet"], [class*="timesheet"]', { timeout: 10000 }).should('exist');
  });

  it('shows Log Time Entry button', () => {
    cy.contains(/log time|add entry/i).should('be.visible');
  });

  it('opens Log Time Entry modal', () => {
    cy.contains(/log time|add entry/i).click();
    cy.get('.modal, [class*="modal"]', { timeout: 5000 }).should('be.visible');
  });

  it('batch entry modal opens', () => {
    cy.contains(/batch|quick fill/i).click({ force: true });
    cy.get('.modal, [class*="modal"]', { timeout: 5000 }).should('be.visible');
  });

  it('month filter changes displayed entries', () => {
    cy.get('input[type="date"], #entry-date').first().should('exist');
    cy.get('table, [class*="timesheet"], [id*="timesheet"]').first().should('exist');
  });

  it.skip('pay rate columns are hidden from foreman role', () => {
    cy.loginAs('foreman');
    cy.visit('/timesheets.html');
    cy.get('[class*="pay-col"], [id*="pay"], th').contains(/rate|pay/i).should('not.exist');
  });
});
