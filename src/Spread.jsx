import React, { memo } from "react";
import Card from "./Card";

const stackOffset = 75;

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
    prev.cards[0].faceUp === next.cards[0].faceUp &&
    prev.selected === next.selected
  ) {
    return true;
  }
  return false;
};

// represents a pile of cards
// cards will be stacked on top of each other
const Spread = ({ cards, cardClickHandler, pileClickHandler, selected }) =>
  cards.length !== 0 ? (
    cards.map((card, i) => (
      <div
        className="w-32 h-48 relative"
        onClick={cards.length === 0 ? pileClickHandler : () => {}}
        key={getUID()}
      >
        <Card
          card={card}
          clickHandler={i === cards.length - 1 ? cardClickHandler : () => {}}
          offset={{ left: `${-(i * stackOffset)}px` }}
          selected={selected}
        />
      </div>
    ))
  ) : (
    <div />
  );

export default memo(Spread, areEqual);
