import * as Solitaire from "./solitaire";

describe("::init", () => {
  it("Initializes the game with 7 tableaus with 1 to 7 cards", () => {
    const game = Solitaire.init(Solitaire.initialState);
    game.tableaus.forEach((t, i) => {
      expect(t.length === i + 1);
    });
  });

  it("initializes tableaus with only 1 card faceup", () => {
    const game = Solitaire.init(Solitaire.initialState);
    game.tableaus.forEach((t, i) => {
      t.forEach((c, idx) => {
        if (idx === 0) {
          expect(c.faceUp === true);
        } else {
          expect(c.faceUp === false);
        }
      });
    });
  });

  it("Initializes a game with 24 cards in the stock", () => {
    const game = Solitaire.init(Solitaire.initialState);
    const game2 = Solitaire.init(Solitaire.initialState);
    expect(game.stock.length === 24);
    expect(game2.stock.length === 24);
  });
});
