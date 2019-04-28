import * as Solitaire from "./solitaire";

export const initialState = {
  selected: { card: null, pileType: null, pileIndex: null },
  game: Solitaire.initialState
};

export const init = state => {
  return {
    selected: initialState.selected,
    game: Solitaire.init(state.game)
  };
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
      selected: initialState.selected
    };
  }
  return {
    ...state,
    game: nextGameState,
    selected: initialState.selected
  };
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "RESET":
      return init(initialState);

    case "DEAL":
      const nextGameState = Solitaire.dealStockCards(state.game);
      return {
        ...state,
        game: nextGameState,
        selected: initialState.selected
      };

    case "SELECT":
      if (state.selected.card) {
        return moveCard(state, action);
      } else if (!state.selected.card) {
        return selectNew(state, action);
      } else {
        return { ...state, selected: initialState.selected };
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

export const dispatchSelect = (dispatch, card, pileType, pileIndex) => {
  return dispatch({
    type: "SELECT",
    pileType,
    pileIndex,
    card
  });
};

export const dispatchSelectEmpty = (dispatch, pileIndex, pileType) => {
  dispatch({ type: "MOVE", pileIndex, pileType });
};

export const dispatchDeal = dispatch => {
  dispatch({ type: "DEAL" });
};

export const dispatchReset = dispatch => {
  dispatch({ type: "RESET" });
};
