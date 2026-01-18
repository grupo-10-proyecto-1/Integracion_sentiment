describe('Sentiment Analysis E2E Tests', () => {
  beforeEach(() => {
    // Visitar la página principal antes de cada test
    cy.visit('http://localhost/');
  });

  it('E2E-01: Happy Path - Análisis Positivo', () => {
    const textoPositivo = 'El sistema funciona de maravilla y es muy rápido';

    // 1. Escribir texto (buscamos un textarea o input)
    cy.get('textarea').first().clear().type(textoPositivo);

    // 2. Click en Analizar
    cy.get('button').contains('Analizar Sentimiento').click();

    // 3. Verificar resultado (esperamos que aparezca "Positivo")
    // Timeout de 10s por si el modelo tarda en despertar
    cy.contains('POSITIVO', { matchCase: false, timeout: 10000 }).should('be.visible');
    cy.screenshot('E2E-01-Resultado-Positivo');
  });

  it('E2E-02: Análisis Negativo', () => {
    const textoNegativo = 'El servicio es terrible y falla constantemente';

    cy.get('textarea, input[type="text"]').first().clear().type(textoNegativo);
    cy.get('button').contains('Analizar Sentimiento').click();

    cy.contains('NEGATIVO', { matchCase: false, timeout: 10000 }).should('be.visible');
    cy.screenshot('E2E-02-Resultado-Negativo');
  });

  it('E2E-04: Persistencia de Historial (Métricas)', () => {
    // Recargamos la página
    cy.reload();

    // Verificamos que se cargue el bloque de métricas históricas
    // (El HTML muestra "Métricas Históricas" y "Total analizados", no la lista de textos)
    cy.contains('Métricas Históricas').should('be.visible');
    cy.contains('Total analizados').should('be.visible');
    cy.screenshot('E2E-04-Historial-Metricas');
  });
});
