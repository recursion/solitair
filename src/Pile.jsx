import React from "react";
import Card from "./Card";

const stackOffset = 30;

// represents a pile of cards
// cards will be stacked on top of each other
const Pile = ({ cards, clickHandler }) => (
  <div className="border-white border-2 rounded w-32 h-48 relative">
    {cards
      .filter(c => c.faceUp)
      .reverse()
      .map((card, i) => (
        <Card
          card={card}
          clickHandler={clickHandler}
          offset={i * stackOffset}
        />
      ))}
  </div>
);
export default Pile;
