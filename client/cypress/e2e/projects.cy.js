describe('Projects E2E Tests', () => {
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInVzZXJuYW1lIjoidGVzdHVzZXIifQ.mock';

  beforeEach(() => {
    cy.clearLocalStorage();
    // Set mock token to simulate logged-in state
    cy.window().then((win) => {
      win.localStorage.setItem('token', mockToken);
      win.localStorage.setItem('username', 'testuser');
    });
  });

  it('should display projects page', () => {
    cy.visit('/projects');
    
    cy.get('h1').should('contain', 'Projects');
  });

  it('should show add project button when authenticated', () => {
    cy.visit('/projects');
    
    // Look for add/create project button
    cy.contains('button', /add|create|new/i).should('be.visible');
  });

  it('should allow navigation to project details', () => {
    cy.visit('/projects');
    
    // If projects exist, click on one
    cy.get('body').then(($body) => {
      if ($body.text().includes('No projects')) {
        cy.log('No projects to test');
      } else {
        // Try to click a project card or link
        cy.get('a, button').contains(/view|details|edit/i).first().click();
      }
    });
  });

  it('should intercept API call for projects', () => {
    // Intercept the API call
    cy.intercept('GET', '/api/projects', {
      statusCode: 200,
      body: [
        {
          _id: '1',
          name: 'Test Project',
          description: 'A test project description',
          startDate: '2024-01-01',
          endDate: '2024-12-31'
        }
      ]
    }).as('getProjects');

    cy.visit('/');
    
    // Wait for the intercepted call
    cy.wait('@getProjects');
    
    // Verify the mocked project appears
    cy.contains('Test Project').should('be.visible');
  });
});
