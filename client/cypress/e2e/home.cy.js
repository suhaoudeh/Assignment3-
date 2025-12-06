describe('Home Page E2E Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('should display the home page with correct elements', () => {
    // Verify the main heading
    cy.get('h1').should('contain', 'Welcome to the Home Page');
    
    // Verify intro paragraph
    cy.contains('A quick snapshot of your projects and education').should('be.visible');
    
    // Verify Projects section
    cy.get('h2').contains('Projects').should('be.visible');
    
    // Verify Education section
    cy.get('h2').contains('Education').should('be.visible');
  });

  it('should show login prompts when not authenticated', () => {
    // Should show login message for projects
    cy.contains('Please log in to view projects').should('be.visible');
    
    // Should show login message for education
    cy.contains('Log in to view education entries').should('be.visible');
  });

  it('should navigate to register page from navigation', () => {
    // Click on Register link
    cy.contains('a', 'Register').click();
    
    // Verify URL changed
    cy.url().should('include', '/register');
    
    // Verify register page loaded
    cy.get('h1').should('contain', 'Register');
  });

  it('should navigate to login page from navigation', () => {
    // Click on Login link
    cy.contains('a', 'Login').click();
    
    // Verify URL changed
    cy.url().should('include', '/login');
    
    // Verify login page loaded
    cy.get('h1').should('contain', 'Login');
  });

  it('should navigate to projects page', () => {
    // Click on Projects link
    cy.contains('a', 'Projects').click();
    
    // Verify URL changed
    cy.url().should('include', '/projects');
  });

  it('should navigate to education page', () => {
    // Click on Education link (if exists in nav)
    cy.contains('a', 'Education').click();
    
    // Verify URL changed
    cy.url().should('include', '/education');
  });
});
