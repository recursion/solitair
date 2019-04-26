import React, { memo } from "react";
import Card from "./Card";

const stackOffset = 30;

let uid = 0;
const getUID = () => uid++;

/**
 * check props.cards for changes
 * if no changes to card values have occured
 * return false to stop the re-render
 *
 *
 */
const shouldRender = (prev, next) => {
  let render = false;
  prev.cards.forEach((card, i) => {
    if (
      next.cards[i].value !== card.value ||
      next.cards[i].suit !== card.suit
    ) {
      render = true;
    }
  });
  return render;
};

// represents a pile of cards
// cards will be stacked on top of each other
const Pile = memo(
  ({ cards, cardClickHandler, pileClickHandler, selected, offset }) => (
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
              offset={offset ? i * stackOffset : 0}
              key={getUID()}
              selected={selected}
            />
          ))
      ) : (
        <Card
          card={cards[0] ? cards[0] : null}
          clickHandler={cardClickHandler}
          selected={selected}
          offset={0}
        />
      )}
    </div>
  ),
  shouldRender
);

export default Pile;
