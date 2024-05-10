Cypress.Commands.add("reactComponent", {
  prevSubject: "element"
}, ($el) => {
  if ($el.length !== 1) {
      throw new Error(`cy.component() requires element of length 1 but got ${$el.length}`);
  }
  // Query for key starting with __reactInternalInstance$ for React v16.x
  const key = Object.keys($el.get(0)).find((key) => key.startsWith("__reactFiber$"));
  const domFiber = $el.prop(key);
  Cypress.log({
      name: "component",
      consoleProps() {
          return {
              component: domFiber,
          };
      },
  });
  return domFiber.return;
});

describe('test marketplace functionality', () => {
  it('filter pass', () => {
    cy.visit('http://localhost:3000/marketplace');
    cy.get('[data-cy="search').type('guitar');
    cy.get('[data-cy="filter"]').click();
    cy.get('[data-cy="geant@seas.upenn.edu"]').should('exist');
  })

  it('filter empty', () => {
    cy.visit('http://localhost:3000/marketplace');
    cy.get('[data-cy="search').type('thisdoesnotexist');
    cy.get('[data-cy="filter"]').click();
    cy.get('[data-cy="search-results"]').children().should('have.length', 0);
  })

  it('filter test slider within range', () => {
    cy.visit('http://localhost:3000/marketplace');
    cy.get('[data-cy="search"]').type('money');
    cy.get('[data-cy="filter"]').click();
    cy.get('[data-cy="geant@seas.upenn.edu"]').should('exist');
  })

  it('filter test slider out of range', () => {
    cy.visit('http://localhost:3000/marketplace');
    cy.get('[data-cy="search').type('money');
    cy.get('[data-cy="filter"]').click();
    cy.get('[data-cy="geant@seas.upenn.edu"]').should('exist');
  })

  it('filter test tags', () => {
    cy.visit('http://localhost:3000/marketplace');
    cy.get('[data-cy="search').type('i have a tag');
    cy.get('[data-cy="tags"]').type('art').type('{enter}');
    cy.get('[data-cy="filter"]').click();
    cy.get('[data-cy="geant@seas.upenn.edu"]').should('exist');
  })
})