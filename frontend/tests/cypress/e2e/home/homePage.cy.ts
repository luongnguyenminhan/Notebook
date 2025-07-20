// cypress/integration/home/homePage.spec.js

describe('Home Page Navigation', () => {
  it('should navigate to the About page when the button is clicked', () => {
    // Visit the home page
    cy.visit('http://localhost:3000/');

    // Click the button to navigate to the About page
    cy.contains('button', 'Go to About Page').click();

    // Verify that the URL is correct
    cy.url().should('include', '/about');

    // Verify that the About page content is displayed
    cy.contains('div', 'About Page').should('be.visible');
  });
});
