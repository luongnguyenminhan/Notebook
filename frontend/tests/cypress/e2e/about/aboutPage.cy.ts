// cypress/e2e/about/aboutPage.spec.js

describe('About Page', () => {
  it('should display the About page content', () => {
    // Visit the about page
    cy.visit('/about');

    // Verify that the About page content is displayed
    cy.contains('div', 'About Page').should('be.visible');
  });
});
