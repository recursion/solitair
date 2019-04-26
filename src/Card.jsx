import React from "react";
import { images } from "./images.js";

const isSelected = (card, selected) => {
  return (
    selected && (card.value === selected.value && card.suit === selected.suit)
  );
};

// represents a card
// can be face up or face down
const Card = ({ card, clickHandler, offset, selected }) => {
  if (!card) return <div />;
  const className = isSelected(card, selected)
    ? `border-4 border-blue rounded`
    : `` + `absolute`;
  if (card.faceUp) {
    return (
      <img
        src={images[card.value + card.suit + ".png"]}
        alt={card.value}
        onClick={() => clickHandler(card)}
        className={className}
        style={{ top: offset }}
      />
    );
  } else {
    return (
      <img
        src={images["blue_back.png"]}
        alt="Playing Card with Blue Back."
        onClick={() => clickHandler(card)}
        className={className}
      />
    );
  }
};
export default Card;
