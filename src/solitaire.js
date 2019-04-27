// Spades, Clubs, Hearts, Diamonds;
const suits = ["S", "C", "H", "D"];

// 13 cards  in each suit
const cards = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K"
];

export const initialState = {
  stock: [],
  foundations: [[], [], [], []],
  tableaus: [[], [], [], [], [], [], []],
  waste: []
};

export const init = state => {
  const nextState = { ...state };
  let cards = shuffle(Deck());

  for (let i = 0; i < nextState.tableaus.length; i++) {
    // during each iteration, add a card to each tableau
    for (let x = 0; x < nextState.tableaus.length; x++) {
      // if this tableau already has a faceup card, move on
      if (nextState.tableaus[x][0] && nextState.tableaus[x][0].faceUp === true)
        continue;

      if (nextState.tableaus[i] === nextState.tableaus[x]) {
        // if this is the first tableau for this iteration
        // make the card faceup
        const next = cards.shift();
        next.faceUp = true;
        nextState.tableaus[x].unshift(next);
      } else {
        nextState.tableaus[x].unshift(cards.shift());
      }
    }
  }
  nextState.stock = cards;
  return nextState;
};

/* return an array of 52 playing cards */
export const Deck = () => {
  const deck = [];
  for (let suit of suits) {
    for (let value of cards) {
      deck.push({ value, suit, faceUp: false });
    }
  }
  return deck;
};

/**
 * Returns a new shuffled deck of cards
 * @param {Deck} deck
 */
export const shuffle = deck => {
  const nextDeck = [...deck];
  let temp;
  for (let i = 0; i < nextDeck.length; i++) {
    let nextIndex = Math.floor(Math.random() * nextDeck.length);
    temp = nextDeck[i];
    nextDeck[i] = nextDeck[nextIndex];
    nextDeck[nextIndex] = temp;
  }
  return nextDeck;
};

// deal 3 cards off the top of the stock pile
// currently they are being put into the waste pile (rather misnamed)
// and this is where the user will see them and be able to use them.
export const dealStockCards = state => {
  const stock = state.stock.slice();
  const waste = state.waste.slice();
  let nextWaste;

  // if there are already visible dealt cards..
  if (state.waste.length > 0) {
    // then those need to be moved to the bottom of the stop
    const wasteCards = waste.splice(0, 3);
    wasteCards.forEach(card => {
      card.faceUp = false;
      stock.push(card);
    });
    nextWaste = [];
  }

  // remove cards from top of stock
  const dealtCards = stock.splice(0, 3);
  dealtCards.forEach(card => {
    card.faceUp = true;
  });

  // put cards into wastepile (misnamed for now)
  nextWaste = dealtCards;

  return {
    ...state,
    stock,
    waste: nextWaste
  };
};

const getCardIndex = (card, pile) => {
  let cardIndex = -1;
  pile.forEach((c, i) => {
    if (c.value === card.value && c.suit === card.suit) {
      cardIndex = i;
    }
  });
  return cardIndex;
};

// try to move a card to a foundation pile
export const moveToFoundation = (state, selected, foundationIndex) => {
  const tableauIndex = selected.pileIndex;
  const nextTableau = state.tableaus[tableauIndex].slice();
  const foundationTarget = state.foundations[foundationIndex];
  const card = selected.card;

  // if foundation is empty, make sure card is an ace
  if (foundationTarget.length === 0 && card.value !== "A") {
    return state;
  }

  // verify card is +1 value from previous card
  const foundationHead = foundationTarget[0];
  const currentCardIndexMinus = cards.indexOf(card.value) - 1;
  const foundationHeadIndex = foundationHead
    ? cards.indexOf(foundationHead.value)
    : -1;

  if (
    foundationHead &&
    (currentCardIndexMinus !== foundationHeadIndex ||
      card.suit !== foundationHead.suit)
  ) {
    return state;
  }

  // remove card from its tableau
  let cardIndex = getCardIndex(card, nextTableau);
  const [removed] = nextTableau.splice(cardIndex, 1);

  // turn the top card face up
  if (nextTableau[0]) {
    nextTableau[0].faceUp = true;
  }

  // add card to its foundation
  const nextFoundation = state.foundations[foundationIndex].slice();
  nextFoundation.unshift(removed);

  const nextFoundations = state.foundations.slice();
  nextFoundations[foundationIndex] = nextFoundation;

  const nextTableaus = [
    ...state.tableaus.slice(0, tableauIndex),
    nextTableau,
    ...state.tableaus.slice(tableauIndex + 1)
  ];

  return { ...state, tableaus: nextTableaus, foundations: nextFoundations };
};

// moves a card from one tableau to another
const tableauSwap = (state, indexFrom, indexTo, card) => {
  const tableauFrom = state.tableaus[indexFrom].slice();
  const tableauTo = state.tableaus[indexTo].slice();
  let nextTableaus = state.tableaus.slice();

  // remove the card from existing pile
  const toCardIndex = getCardIndex(card, tableauFrom);
  const removedCards = tableauFrom.splice(0, toCardIndex + 1);

  // turn the top card face up
  if (tableauFrom[0]) {
    tableauFrom[0].faceUp = true;
  }

  // add the card to the new pile
  for (let card of removedCards.reverse()) {
    tableauTo.unshift(card);
  }

  nextTableaus[indexFrom] = tableauFrom;
  nextTableaus[indexTo] = tableauTo;
  return nextTableaus;
};

const moveFromStockToTableau = (state, indexTo) => {
  const waste = state.waste.slice();
  const tableauTo = state.tableaus[indexTo].slice();
  const nextTableaus = state.tableaus.slice();

  // remove the card from existing pile
  const [moveCard] = waste.reverse().splice(0, 1);

  const fromCardIndex = cards.indexOf(moveCard.value);
  if (cards[fromCardIndex + 1] === tableauTo[0].value) {
    tableauTo.unshift(moveCard);

    nextTableaus[indexTo] = tableauTo;
    return {
      ...state,
      waste: waste.reverse(),
      tableaus: nextTableaus
    };
  }

  return {
    ...state,
    waste: state.waste,
    tableaus: state.tableaus
  };
};

// check if a move is allowed
// we could just return a true, and then update the deck and tableau?
// likely this will be moving one card from a tableau to a new tableau
// so we could just pass two tableaus, and verify the move,
// then returning the updated tableaus
export const moveToTableau = (state, selected, indexTo) => {
  const indexFrom = selected.pileIndex;
  const card = selected.card;
  const tableauTo = state.tableaus[indexTo];

  // if the tableau is empty, we can only move kings here
  if (tableauTo.length === 0 && card.value === "K") {
    if (selected.pileType === "TABLEAU") {
      return {
        ...state,
        tableaus: tableauSwap(state, indexFrom, indexTo, card)
      };
    } else {
      // pileType is likely "STOCK"
      // move from wastePile to tableau
      return moveFromStockToTableau(state, indexTo);
    }
  } else {
    if (selected.pileType === "STOCK") {
      return moveFromStockToTableau(state, indexTo);
    }

    const toCard = state.tableaus[indexTo][0];
    const fromCardIndex = cards.indexOf(toCard.value);

    // can't place below lowest card (an ace)
    if (fromCardIndex === 0) return state;

    // if the value of our card is 1 level below the card we are moving to
    if (cards[fromCardIndex - 1] === card.value) {
      return {
        ...state,
        tableaus: tableauSwap(state, indexFrom, indexTo, card)
      };
    }
  }
  return state;
};

// const checkForWin = foundations => {};

// Rules

// deck of cards 4 suits a-k where ace is the low card

// the stock - your hand

// stacks of cards - 7 stacks = the tableau

// foundations = 4 piles on which a whole suit or sequence must be built up
// generally the aces are the base of the foundation

// the waste pile - cards from the stock pile that have no place in the tableau or the foundations

// tableau formation: create seven piles from left to right
// first card is placed face up
// deal one card face down for next six piles
// from left to right, 2nd pile gets 1 card face up
// deal one card face down for next 5 piles
// .... etc until final pile has a face up card.

// remaining cards go in stock pile

// when starting out the foundations and waste pile do not have any cards.

// rules for stacking on foundations
// start with ace
// must be sequential and suited

// rules for stacking on tableau
// must be sequential
// empty tableau can only take a king
// alternate rule sets include requiring alternating colors on the tableau stack

// possible components
// foundation, tableau, waste, stock(hand), table

// tables holds all other components, and checks rules when moves are made.

// game rules file for applying/checking movements / returning new state
