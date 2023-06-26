describe("template spec", () => {
  it("Navigates to the home page", () => {
    cy.visit("http://localhost:3000");
  });
  it("Clicks on the search bar", () => {
    cy.visit("http://localhost:3000");
    cy.get('[data-test="search-button-trigger"]').click();
  });
  it("Does a search", () => {
    cy.visit("http://localhost:3000");
    cy.get('[data-test="search-button-trigger"]').click();
    cy.get('[data-test="search-button-input"]').type("Unisex");
    cy.wait(1000);
    cy.get('[data-test="search-button-product-result"]').should("exist");
    cy.get('[data-test="search-button-collection-result"]').should("exist");
  });
});
