import * as cards from "./solitaire";

describe("Deck", () => {
  it("returns a new unshuffled deck containing 52 elements", () => {
    let deck = cards.Deck();
    expect(deck.length === 52);
  });
});
