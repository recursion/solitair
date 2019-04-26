import React from "react";
import Card from "./Card";

const stackOffset = 30;

let uid = 0;
const getUID = () => uid++;

// represents a pile of cards
// cards will be stacked on top of each other
const Pile = ({ cards, cardClickHandler, pileClickHandler }) => (
  <div
    className="border-white border-2 rounded w-32 h-48 relative"
    onClick={cards.length === 0 ? pileClickHandler : () => {}}
  >
    {cards[0] && cards[0].faceUp ? (
      cards
        .filter(c => c.faceUp)
        .reverse()
        .map((card, i) => (
          <Card
            card={card}
            clickHandler={cardClickHandler}
            offset={i * stackOffset}
            key={getUID()}
          />
        ))
    ) : (
      <Card
        card={cards[0] ? cards[0] : null}
        clickHandler={cardClickHandler}
        offset={0}
      />
    )}
  </div>
);
export default Pile;
