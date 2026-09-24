describe('Pantalla inicial', () => {
  it('muestra el título Movie Rater', () => {
    cy.visit('/')
    cy.contains('ion-title', 'Movie Rater')
    cy.contains('¡Bienvenido a Movie Rater!')
  })
})
