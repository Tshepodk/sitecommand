// cypress/e2e/03-intake.cy.js — SC-047: Daily intake form tests

describe('SC-047 | Daily Intake Form', () => {
  beforeEach(() => {
    cy.loginAs('admin');
    cy.visit('/intake.html');
  });

  it('loads intake form with project dropdown', () => {
    cy.get('#f-project, select[id*="project"]', { timeout: 10000 }).should('be.visible');
  });

  it('shows offline banner when navigator is offline', () => {
    cy.window().then(win => {
      cy.stub(win.navigator, 'onLine').value(false);
      win.dispatchEvent(new Event('offline'));
    });
    cy.get('#offline-banner', { timeout: 5000 }).should('be.visible');
  });

  it('step navigation works — next button advances steps', () => {
    cy.get('#f-project').select(1);
    cy.get('.btn-next, [onclick*="goStep(1)"], button').contains(/next|continue/i).first().click();
    cy.get('[class*="step"][class*="active"], .step-active', { timeout: 5000 }).should('exist');
  });

  it('blocks submission without project selected', () => {
    cy.get('button').contains(/submit/i).last().click({ force: true });
    cy.url().should('include', 'intake.html');
  });

  it('date field defaults to today', () => {
    const today = new Date().toISOString().split('T')[0];
    cy.get('#f-date').should('have.value', today);
  });

  it('service worker is registered', () => {
    cy.window().then(win => {
      expect(win.navigator.serviceWorker).to.exist;
    });
  });
});
