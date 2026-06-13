// cypress/e2e/02-pmo-hub.cy.js — SC-047: PMO Hub & Dashboard tests

describe('SC-047 | PMO Hub — Dashboard', () => {
  beforeEach(() => {
    cy.loginAs('admin');
    cy.visit('/index.html');
  });

  it('loads PMO Hub with project cards', () => {
    cy.get('.stat-card, [class*="stat-card"]', { timeout: 10000 }).first().should('be.visible');
  });

  it('shows EAC/ETC tab and loads data', () => {
    cy.contains(/pmo hub/i).click();
    cy.contains(/eac|etc/i).first().click({ force: true });
    cy.get('table, [class*="eac"], [id*="eac"]', { timeout: 8000 }).first().should('exist');
  });

  it('shows Stage Gates tab', () => {
    cy.contains(/pmo hub/i).click();
    cy.contains(/stage gates/i).first().click({ force: true });
    cy.get('[class*="gate"], [id*="gate"], table', { timeout: 8000 }).first().should('exist');
  });

  it('project filter updates dashboard content', () => {
    cy.get('select').first().select(1, { force: true });
    cy.get('.stat-card, [class*="stat"]').first().should('be.visible');
  });

  it('navigation sidebar links are visible', () => {
    cy.contains(/dashboard/i).should('exist');
    cy.contains(/pmo hub/i).should('exist');
    cy.contains(/daily reports/i).should('exist');
  });
});
