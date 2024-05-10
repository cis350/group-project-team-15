describe('Login', () => {
  it('should login', () => {
      cy.visit('http://localhost:3000/login');
      cy.get('input[name="email"]').type('bbob');
      cy.get('input[name="password"]').type('job');
      cy.get('button[type="submit"]').click();
      cy.url().should('eq', 'http://localhost:3000/profile/bbob');
  });

  it('should fail to login', () => {
      cy.visit('http://localhost:3000/login');
      cy.get('input[name="email"]').type('bbob');
      cy.get('input[name="password"]').type('wrong');
      cy.get('button[type="submit"]').click();
      cy.get('p').should('have.text', 'LoginError: authentication failed (incorrect password)');
  });

  it('should fail to login with empty fields', () => {
      cy.visit('http://localhost:3000/login');
      cy.get('button[type="submit"]').click();
      cy.get('p').should('have.text', 'LoginError: empty or missing email and password');
  });

  it('should fail to login with non-existent email', () => {
      cy.visit('http://localhost:3000/login');
      cy.get('input[name="email"]').type('nonexistent');
      cy.get('input[name="password"]').type('wrong');
      cy.get('button[type="submit"]').click();
      cy.get('p').should('have.text', 'Loginemail does not exist: nonexistent');
  });

  // registration test cases
  // it('should register', () => {
  //     cy.visit('http://localhost:3000/register');
  //     cy.get('input[name="email"]').type('bbob2');
  //     cy.get('input[name="password"]').type('job');
  //     cy.get('input[name="confirmPassword"]').type('job');
  //     cy.get('button[type="submit"]').click();
  //     cy.url().should('eq', 'http://localhost:3000/login');
  // });

  it('should fail to register with empty fields', () => {
      cy.visit('http://localhost:3000/register');
      cy.get('button[type="submit"]').click();
      cy.get('p').should('have.text', 'RegisterError: empty or missing email and password');
  });

  it('should fail to register with existing email', () => {
      cy.visit('http://localhost:3000/register');
      cy.get('input[name="email"]').type('bbob');
      cy.get('input[name="password"]').type('job');
      cy.get('input[name="confirmPassword"]').type('job');
      cy.get('button[type="submit"]').click();
      cy.get('p').should('have.text', 'RegisterError: email already exists');
  });

  it('should fail to register with not matching passwords', () => {
    cy.visit('http://localhost:3000/register');
    cy.get('input[name="email"]').type('bbob');
    cy.get('input[name="password"]').type('job');
    cy.get('input[name="confirmPassword"]').type('a');
    cy.get('button[type="submit"]').click();
    cy.get('p').should('have.text', 'RegisterError: passwords must match');
  });
});