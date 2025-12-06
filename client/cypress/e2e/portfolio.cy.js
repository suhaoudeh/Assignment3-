describe('Portfolio Home Page', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/');
  });

  it('should load the home page successfully', () => {
    cy.contains('Welcome to the Home Page').should('be.visible');
  });

  it('should display the intro paragraph', () => {
    cy.contains('A quick snapshot of your projects and education').should('be.visible');
  });

  it('should show Projects and Education sections', () => {
    cy.contains('h2', 'Projects').should('be.visible');
    cy.contains('h2', 'Education').should('be.visible');
  });

  it('should display login prompts when not authenticated', () => {
    cy.contains('Please log in to view projects').should('be.visible');
    cy.contains('Log in to view education entries').should('be.visible');
  });

  it('should have navigation links', () => {
    // Check if navigation exists (adjust based on your actual nav structure)
    cy.get('nav').should('exist');
  });

  it('should navigate to projects list page', () => {
    cy.contains('a', 'Projects').click();
    cy.url().should('include', '/projects');
  });

  it('should navigate to education page', () => {
    cy.contains('a', 'Education').click();
    cy.url().should('include', '/education');
  });
});

describe('User Registration Flow', () => {
  it('should navigate to register page', () => {
    cy.visit('/');
    cy.contains('a', 'Register').click();
    cy.url().should('include', '/register');
    cy.contains('Register').should('be.visible');
  });

  it('should show registration form fields', () => {
    cy.visit('/register');
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should register a new user', () => {
    cy.visit('/register');
    
    const timestamp = Date.now();
    const testUser = {
      username: `testuser${timestamp}`,
      email: `test${timestamp}@example.com`,
      password: 'TestPassword123!'
    };

    cy.get('input[name="username"]').type(testUser.username);
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();

    // Should redirect to home or show success
    cy.url().should('not.include', '/register');
  });
});

describe('User Login Flow', () => {
  it('should navigate to login page', () => {
    cy.visit('/');
    cy.contains('a', 'Login').click();
    cy.url().should('include', '/login');
  });

  it('should show login form', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // Should show error message
    cy.contains('User not found').should('be.visible');
  });
});

describe('Projects Management (Authenticated)', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('testpassword');
    cy.get('button[type="submit"]').click();
    cy.wait(1000); // Wait for login to complete
  });

  it('should display projects when logged in', () => {
    cy.visit('/');
    // Should not show login prompt
    cy.contains('Please log in to view projects').should('not.exist');
  });

  it('should navigate to project list', () => {
    cy.visit('/projects');
    cy.contains('Projects').should('be.visible');
  });

  it('should be able to create a new project', () => {
    cy.visit('/projects');
    cy.contains('Add Project').click();
    
    cy.get('input[name="name"]').type('Test Project');
    cy.get('textarea[name="description"]').type('This is a test project');
    cy.get('input[name="startDate"]').type('2024-01-01');
    cy.get('input[name="endDate"]').type('2024-12-31');
    
    cy.get('button[type="submit"]').click();
    
    // Should show the new project
    cy.contains('Test Project').should('be.visible');
  });
});

describe('Education Management (Authenticated)', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('testpassword');
    cy.get('button[type="submit"]').click();
    cy.wait(1000);
  });

  it('should navigate to education page', () => {
    cy.visit('/education');
    cy.contains('Education').should('be.visible');
  });

  it('should show add education button when logged in', () => {
    cy.visit('/education');
    cy.contains('Add Education').should('be.visible');
  });

  it('should be able to add education entry', () => {
    cy.visit('/education');
    cy.contains('Add Education').click();
    
    cy.get('input[name="degree"]').type('Bachelor of Science');
    cy.get('input[name="institution"]').type('Test University');
    cy.get('input[name="startDate"]').type('2020');
    cy.get('input[name="endDate"]').type('2024');
    cy.get('textarea[name="description"]').type('Computer Science degree');
    
    cy.get('button[type="submit"]').click();
    
    // Should show the new education entry
    cy.contains('Bachelor of Science').should('be.visible');
  });
});

describe('Responsive Design', () => {
  const viewports = [
    { device: 'iphone-6', width: 375, height: 667 },
    { device: 'ipad-2', width: 768, height: 1024 },
    { device: 'macbook-15', width: 1440, height: 900 }
  ];

  viewports.forEach(({ device, width, height }) => {
    it(`should display correctly on ${device}`, () => {
      cy.viewport(width, height);
      cy.visit('/');
      cy.contains('Welcome to the Home Page').should('be.visible');
      cy.get('nav').should('be.visible');
    });
  });
});
