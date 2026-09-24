describe('Componente Saludo', () => {
  it('muestra el nombre y saluda al tocar el botón', () => {
    cy.visit('/')
    cy.contains('ion-card-title', 'William')
    cy.contains('ion-button', 'Saludar').click()
    cy.contains('¡Hola, William! Bienvenido a Movie Rater')
  })
})
