describe('test marketplace functionality', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/marketplace');
    cy.get('[data-cy="marketplace-search"]').type('guitar');
    cy.get('[data-cy="geant@seas.upenn.edu"]').should('exist');
  })

  it('nothing shows up', () => {
    cy.visit('http://localhost:3000/marketplace');
    cy.get('[data-cy="marketplace-search"]').type('00012321');
    cy.get('[data-cy="search-results"]').children().should('have.length', 0);
  })
})