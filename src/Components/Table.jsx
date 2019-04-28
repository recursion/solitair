import React, { useReducer } from "react";
import WinModal from "./WinModal";
import Pile from "./Pile";
import Spread from "./Spread";
import {
  reducer,
  initialState,
  dispatchDeal,
  dispatchReset,
  dispatchSelect,
  dispatchSelectEmpty
} from "./tableReducer";

// generate UIDs for component keys
// TODO: something better
let uid = 0;
const getUID = () => {
  return uid++;
};

// represents the solitaire table
// a table has:
// a stock (the "hand")
// a waste pile (currently used to display visible cards from the stock)
// 4 foundation piles (where you build the finished suit stacks from aces)
// 7 tableau piles (the working piles) - currently allowed to stack any sequenced cards
// will eventually be a rule set for allowing only alternating colors to stack on tableaus
const Table = () => {
  const [state, dispatch] = useReducer(reducer, initialState());
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
        <button
          className="fixed pin-r pin-b bg-white border border-black rounded m-3 p-3"
          onClick={() => dispatchReset(dispatch)}
        >
          Deal New
        </button>
      </div>
      {state.game.winner && <WinModal reset={() => dispatchReset(dispatch)} />}
    </>
  );
};
export default Table;
