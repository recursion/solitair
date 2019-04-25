import React, { useReducer } from "react";
import Pile from "./Pile";
import { initialState, init } from "./solitaire";

const reducer = (state, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

// represents the solitaire table
// a table has:
// a stock (the "hand")
// 4 foundation piles
// 7 tableau piles
// a waste pile
const Table = () => {
  const [gameState, dispatch] = useReducer(reducer, initialState, init);

  return (
    <div className="bg-green-light w-screen h-screen flex flex-col items-stretch justify-between p-1">
      <div className="flex flex-row justify-end">
        <div className="flex-grow" />
        <div className="flex-grow flex flex-row justify-around">
          <Pile cards={gameState.foundations[0]} />
          <Pile cards={gameState.foundations[1]} />
          <Pile cards={gameState.foundations[2]} />
          <Pile cards={gameState.foundations[3]} />
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <Pile cards={gameState.tableaus[0]} />
        <Pile cards={gameState.tableaus[1]} />
        <Pile cards={gameState.tableaus[2]} />
        <Pile cards={gameState.tableaus[3]} />
        <Pile cards={gameState.tableaus[4]} />
        <Pile cards={gameState.tableaus[5]} />
        <Pile cards={gameState.tableaus[6]} />
      </div>
      <div className="flex flex-row justify-around">
        <Pile cards={gameState.stock} />
        <Pile cards={gameState.waste} />
      </div>
    </div>
  );
};
export default Table;
