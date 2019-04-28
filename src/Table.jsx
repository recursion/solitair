import React, { useReducer } from "react";
import WinModal from "./WinModal";
import Pile from "./Pile";
import Spread from "./Spread";
import * as Solitaire from "./solitaire";

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

// generate UIDs for component keys
// TODO: something better
let uid = 0;
const getUID = () => {
  return uid++;
};

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
  // TODO: handle moving from a foundation
  let nextGameState;
  if (action.pileType === "FOUNDATION") {
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
  } else {
    // pileType is STOCK or something else we cant move to
    return {
      ...state,
      selected: initialGameState.selected
    };
  }
  return {
    ...state,
    game: nextGameState,
    selected: initialGameState.selected
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case "RESET":
      return init(initialGameState);

    case "DEAL":
      const nextGameState = Solitaire.dealStockCards(state.game);
      return {
        ...state,
        game: nextGameState,
        selected: initialGameState.selected
      };

    case "SELECT":
      if (state.selected.card) {
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

const dispatchSelect = (dispatch, card, pileType, pileIndex) => {
  return dispatch({
    type: "SELECT",
    pileType,
    pileIndex,
    card
  });
};

const dispatchSelectEmpty = (dispatch, pileIndex, pileType) => {
  dispatch({ type: "MOVE", pileIndex, pileType });
};

const dispatchDeal = dispatch => {
  dispatch({ type: "DEAL" });
};

const dispatchReset = dispatch => {
  dispatch({ type: "RESET" });
};

// represents the solitaire table
// a table has:
// a stock (the "hand")
// 4 foundation piles
// 7 tableau piles
// a waste pile
const Table = () => {
  const [state, dispatch] = useReducer(reducer, initialGameState, init);
  // TODO: Display winner and offer restart

  return (
    <>
      <div className="bg-green-light w-screen h-screen flex flex-col items-stretch justify-start p-2">
        <div className="flex flex-row justify-end">
          <div className="">
            <Pile
              cards={state.game.stock}
              selected={state.selected.card}
              offSet={false}
              cardClickHandler={() => {
                dispatchDeal(dispatch);
              }}
            />
          </div>
          <div className="flex flex-row justify-around ml-20">
            <Spread
              cards={state.game.waste}
              selected={state.selected.card}
              cardClickHandler={card => {
                dispatchSelect(dispatch, card, "STOCK", 0);
              }}
            />
          </div>
          <div className="flex-grow" />
          <div className="w-2/5 flex flex-row justify-around">
            {state.game.foundations.map((f, i) => (
              <Pile
                cards={state.game.foundations[i]}
                key={getUID()}
                offSet={false}
                cardClickHandler={card =>
                  dispatchSelect(dispatch, card, "FOUNDATION", i)
                }
                pileClickHandler={() => {
                  dispatchSelectEmpty(dispatch, i, "FOUNDATION");
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
              cardClickHandler={card =>
                dispatchSelect(dispatch, card, "TABLEAU", i)
              }
              pileClickHandler={() => {
                dispatchSelectEmpty(dispatch, i, "TABLEAU");
              }}
              selected={state.selected.card}
            />
          ))}
        </div>
      </div>
      {state.game.winner && <WinModal reset={() => dispatchReset(dispatch)} />}
    </>
  );
};
export default Table;
