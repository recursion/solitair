import React, { useReducer } from "react";
import Pile from "./Pile";
import * as Solitaire from "./solitaire";

const unHighlightCard = (state, action, pileGroup) => {
  let nextPile = state.game[pileGroup][state.selected.pileIndex];
  nextPile = nextPile.map(card => {
    if (
      state.selected.card.value === card.value &&
      state.selected.card.suit === card.suit
    ) {
      return { ...card, selected: false };
    } else {
      return card;
    }
  });
  return [
    ...state.game[pileGroup].slice(0, state.selected.pileIndex),
    nextPile,
    ...state.game[pileGroup].slice(state.selected.pileIndex + 1)
  ];
};

const highlightCard = (state, action, pileGroup, selected = false) => {
  let nextPile = state.game[pileGroup][action.pileIndex];
  nextPile = nextPile.map(card => {
    if (card.value === action.card.value && card.suit === action.card.suit) {
      return { ...card, selected };
    } else {
      return card;
    }
  });
  return [
    ...state.game[pileGroup].slice(0, action.pileIndex),
    nextPile,
    ...state.game[pileGroup].slice(action.pileIndex + 1)
  ];
};

// we have selected a new card for movement
const selectNew = (state, action) => {
  const nextSelected = {
    ...state.selected,
    card: action.card,
    pileType: action.pileType,
    pileIndex: action.pileIndex
  };
  let nextFoundations = state.game.foundations;
  let nextTableaus = state.game.tableaus;

  if (action.pileType === "FOUNDATION") {
    nextFoundations = highlightCard(state, action, "foundations", true);
  } else if (action.pileType === "TABLEAU") {
    nextTableaus = highlightCard(state, action, "tableaus", true);
  }

  return {
    ...state,
    game: {
      ...state.game,
      foundations: nextFoundations,
      tableaus: nextTableaus
    },
    selected: nextSelected
  };
};

// we already have a card selected, and now have clicked on the location we want to place it
// determine if the move is legal and move it, or fail.
const moveCard = (state, action) => {
  let nextFoundations = [...state.game.foundations];
  let nextTableaus = [...state.game.tableaus];

  if (action.pileType === "FOUNDATION") {
    nextFoundations = unHighlightCard(state, action, "foundations");
    // TODO: handle moving from a foundation
  } else if (action.pileType === "TABLEAU") {
    nextTableaus = unHighlightCard(state, action, "tableaus");
    nextTableaus = Solitaire.moveToTableau(
      nextTableaus,
      state.selected.pileIndex,
      action.pileIndex,
      state.selected.card
    );
  }
  return {
    ...state,
    game: {
      ...state.game,
      foundations: nextFoundations,
      tableaus: nextTableaus
    },
    selected: initialGameState.selected
  };
};

const moveToEmptyFoundation = (state, action) => {
  let nextTableaus = unHighlightCard(state, action, "tableaus");

  const nextGameState = Solitaire.moveToEmptyFoundation(
    { ...state.game, tableaus: nextTableaus },
    state.selected.card,
    state.selected.pileIndex,
    action.pileIndex
  );
  debugger;
  return {
    ...state,
    game: nextGameState,
    selected: initialGameState.selected
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SELECT":
      // TODO: if this was a click on the "stock" then deal cards
      // or if the "wastepile" do nothing (wastepile should be removed / treated as the bottom of the stock)
      if (state.selected.card) {
        return moveCard(state, action);
      }
      return selectNew(state, action);

    case "MOVE_TO_FOUNDATION":
      if (state.selected.card) {
        return moveToEmptyFoundation(state, action);
      }
      return state;

    case "MOVE_TO_TABLEAU":
      return state;

    default:
      return state;
  }
};

const initialGameState = {
  selected: { card: null, pileType: null, pileIndex: null },
  game: Solitaire.initialState
};

const init = state => {
  return {
    selected: initialGameState.selected,
    game: Solitaire.init(state.game)
  };
};

const dispatchSelectFoundation = (dispatch, card, pileIndex) => {
  console.log("OMG");
  return dispatch({
    type: "SELECT",
    pileType: "FOUNDATION",
    pileIndex,
    card
  });
};

const dispatchSelectTableau = (dispatch, card, pileIndex) => {
  return dispatch({
    type: "SELECT",
    pileType: "TABLEAU",
    pileIndex,
    card
  });
};

const dispatchSelectEmptyFoundation = (dispatch, pileIndex) => {
  console.log("WHY");
  dispatch({ type: "MOVE_TO_FOUNDATION", pileIndex });
};

const dispatchSelectEmptyTableau = (dispatch, pileIndex) => {
  dispatch({ type: "MOVE_TO_TABLEAU", pileIndex });
};

let uid = 0;
const getUID = () => {
  return uid++;
};

// represents the solitaire table
// a table has:
// a stock (the "hand")
// 4 foundation piles
// 7 tableau piles
// a waste pile
const Table = () => {
  const [state, dispatch] = useReducer(reducer, initialGameState, init);

  return (
    <div className="bg-green-light w-screen h-screen flex flex-col items-stretch justify-start p-2">
      <div className="flex flex-row justify-end">
        <div className="flex-grow">
          <Pile cards={state.game.stock} />
        </div>
        <div className="flex-grow" />
        <div className="flex-grow" />
        <div className="flex-grow flex flex-row justify-around">
          {state.game.foundations.map((f, i) => (
            <Pile
              cards={state.game.foundations[i]}
              key={getUID()}
              cardClickHandler={card =>
                dispatchSelectFoundation(dispatch, card, i)
              }
              pileClickHandler={() => {
                dispatchSelectEmptyFoundation(dispatch, i);
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-row items-start justify-around mt-5">
        {state.game.tableaus.map((t, i) => (
          <Pile
            cards={state.game.tableaus[i]}
            key={getUID()}
            cardClickHandler={card => dispatchSelectTableau(dispatch, card, i)}
            pileClickHandler={() => {
              dispatchSelectEmptyTableau(dispatch, i);
            }}
          />
        ))}
      </div>
    </div>
  );
};
export default Table;
