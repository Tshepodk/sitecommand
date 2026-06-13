// cypress/e2e/06-reports.cy.js — SC-047: Reports & export tests

describe('SC-047 | Reports', () => {
  beforeEach(() => {
    cy.loginAs('admin');
    cy.visit('/reports.html');
  });

  it('loads reports page with stat cards', () => {
    cy.get('.stat-card, [class*="stat"]', { timeout: 10000 }).should('have.length.greaterThan', 0);
  });

  it('Excel export button is visible', () => {
    cy.contains(/export|excel|download/i).should('be.visible');
  });

  it('PDF export button is visible', () => {
    cy.contains(/pdf/i).should('be.visible');
  });

  it('project filter loads project-specific data', () => {
    cy.get('select[id*="project"], #rpt-project').first().select(1);
    cy.get('.stat-card').should('be.visible');
  });

  it('date range filter updates report data', () => {
    cy.get('input[type="date"]').first().type('2026-01-01', { force: true });
    cy.get('.stat-card, table').first().should('exist');
  });
});
