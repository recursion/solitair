import React, { useReducer } from "react";
import Pile from "./Pile";
import * as Solitaire from "./solitaire";

// we have selected a new card for movement
const selectNew = (state, action) => {
  const nextSelected = {
    ...state.selected,
    card: action.card,
    pileType: action.pileType,
    pileIndex: action.pileIndex
  };

  return {
    ...state,
    selected: nextSelected
  };
};

// we already have a card selected, and now have clicked on the location we want to place it
// determine if the move is legal and move it, or fail.
const moveCard = (state, action) => {
  let nextGameState;
  if (action.pileType === "FOUNDATION") {
    // TODO: handle moving from a foundation
    nextGameState = Solitaire.moveToFoundation(
      state.game,
      state.selected,
      action.pileIndex
    );
  } else if (action.pileType === "TABLEAU") {
    nextGameState = Solitaire.moveToTableau(
      state.game,
      state.selected,
      action.pileIndex
    );
  }
  return {
    ...state,
    game: nextGameState,
    selected: initialGameState.selected
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case "DEAL":
      const nextGameState = Solitaire.dealStockCards(state.game);
      return { ...state, game: nextGameState };

    case "USE_STOCK_CARD":
      return state;

    case "SELECT":
      if (state.selected.card && state.selected.pileType !== "STOCK") {
        return moveCard(state, action);
      } else if (!state.selected.card) {
        return selectNew(state, action);
      } else {
        return { ...state, selected: initialGameState.selected };
      }

    case "MOVE":
      if (state.selected.card) {
        return moveCard(state, action);
      }
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

const dispatchSelectStockCard = (dispatch, card) => {
  dispatch({
    type: "SELECT",
    pileType: "STOCK",
    pileIndex: 0,
    card
  });
};

const dispatchSelectEmptyFoundation = (dispatch, pileIndex) => {
  dispatch({ type: "MOVE", pileIndex, pileType: "FOUNDATION" });
};

const dispatchSelectEmptyTableau = (dispatch, pileIndex) => {
  dispatch({ type: "MOVE", pileIndex, pileType: "TABLEAU" });
};

const dispatchDeal = dispatch => {
  dispatch({ type: "DEAL" });
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
          <Pile
            cards={state.game.stock}
            selected={state.selected.card}
            offSet={false}
            cardClickHandler={card => {
              dispatchDeal(dispatch);
            }}
          />
        </div>
        <div className="flex-grow flex flex-row justify-around">
          <Pile
            cards={state.game.waste}
            selected={state.selected.card}
            offSet={false}
            cardClickHandler={card => {
              console.log(state.selected);
              console.log(card);
              dispatchSelectStockCard(dispatch, card);
            }}
          />
        </div>
        <div className="flex-grow" />
        <div className="flex-grow flex flex-row justify-around">
          {state.game.foundations.map((f, i) => (
            <Pile
              cards={state.game.foundations[i]}
              key={getUID()}
              offSet={false}
              cardClickHandler={card =>
                dispatchSelectFoundation(dispatch, card, i)
              }
              pileClickHandler={() => {
                dispatchSelectEmptyFoundation(dispatch, i);
              }}
              selected={state.selected.card}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-row items-start justify-around mt-5">
        {state.game.tableaus.map((t, i) => (
          <Pile
            offset={true}
            cards={state.game.tableaus[i]}
            key={getUID()}
            cardClickHandler={card => dispatchSelectTableau(dispatch, card, i)}
            pileClickHandler={() => {
              dispatchSelectEmptyTableau(dispatch, i);
            }}
            selected={state.selected.card}
          />
        ))}
      </div>
    </div>
  );
};
export default Table;
