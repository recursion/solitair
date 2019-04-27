import React, { memo } from "react";
import Card from "./Card";

const stackOffset = 35;

let uid = 0;
const getUID = () => uid++;

/**
 * check props.cards for changes
 * if no changes to card values have occured
 * return false to stop the re-render
 *
 *
 */
const areEqual = (prev, next) => {
  if (
    prev.cards[0] &&
    next.cards[0] &&
    prev.cards[0].suit === next.cards[0].suit &&
    prev.cards[0].value === next.cards[0].value &&
    prev.cards[0].faceUp === next.cards[0].faceUp
  ) {
    return true;
  }
  return false;
};

// represents a pile of cards
// cards will be stacked on top of each other
const Pile = ({
  cards,
  cardClickHandler,
  pileClickHandler,
  selected,
  offset
}) => (
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
            offset={offset ? { top: `${i * stackOffset}px` } : null}
            key={getUID()}
            selected={selected}
          />
        ))
    ) : (
      <Card
        card={cards[0] ? cards[0] : null}
        clickHandler={cardClickHandler}
        selected={selected}
      />
    )}
  </div>
);

export default memo(Pile, areEqual);
