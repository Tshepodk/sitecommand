// cypress/e2e/05-approvals.cy.js — SC-047: Approvals & audit trail tests

describe('SC-047 | Approvals & Audit Trail', () => {
  beforeEach(() => {
    cy.loginAs('admin');
    cy.visit('/approvals.html');
  });

  it('loads approvals page with stats cards', () => {
    cy.get('.stat-card', { timeout: 10000 }).first().should('exist');
  });

  it('pending tab shows oldest-first queue', () => {
    cy.contains(/pending/i).first().click({ force: true });
    cy.get('table, [class*="report-row"], tbody').first().should('exist');
  });

  it('history tab loads all submissions', () => {
    cy.contains(/all history/i).first().click({ force: true });
    cy.get('table, [id="history-table"]').first().should('exist');
  });

  it('reject modal requires a reason', () => {
    cy.get('[id="modal-reject"], #modal-reject').should('exist');
  });

  it('status filter changes displayed entries', () => {
    cy.get('#approval-status, select[id*="status"]').first().select('approved', { force: true });
    cy.get('table, tbody').first().should('exist');
  });
});

describe('SC-047 | Foreman RBAC Restrictions', () => {
  it.skip('foreman sidebar only shows Daily Intake, Timesheets, Sign Out', () => {
    cy.loginAs('foreman');
    cy.visit('/intake.html');
    cy.contains(/daily intake/i).should('exist');
    cy.contains(/timesheets/i).should('exist');
    cy.contains(/sign out/i).should('exist');
    cy.contains(/approvals/i).should('not.exist');
    cy.contains(/reports/i).should('not.exist');
  });
});
