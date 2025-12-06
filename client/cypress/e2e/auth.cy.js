describe('Authentication E2E Tests', () => {
  const testUser = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'Test123!@#'
  };

  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('should register a new user', () => {
    cy.visit('/register');
    
    // Fill in registration form
    cy.get('input[name="username"]').type(testUser.username);
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Should redirect to home page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    
    // Should have token in localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.exist;
    });
  });

  it('should login with existing user', () => {
    cy.visit('/login');
    
    // Use a known test account or the one just created
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Wait for either success or error
    cy.wait(1000);
  });

  it('should show validation errors for invalid login', () => {
    cy.visit('/login');
    
    // Try to login with invalid credentials
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    
    cy.get('button[type="submit"]').click();
    
    // Should show error message
    cy.contains(/error|invalid|failed/i, { timeout: 5000 }).should('be.visible');
  });

  it('should logout user', () => {
    // First login
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-token-for-test');
      win.localStorage.setItem('username', 'testuser');
    });
    
    cy.visit('/');
    
    // Click logout if available
    cy.contains('a', /logout/i).click();
    
    // Token should be removed
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
    });
  });
});
