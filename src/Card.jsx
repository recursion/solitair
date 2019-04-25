import React from "react";
import { images } from "./images.js";

// represents a card
// can be face up or face down
const Card = ({ card }) => {
  if (card.faceUp) {
    return <img src={images[card.value + ".png"]} alt={card.value} />;
  } else {
    return (
      <img src={images["blue_back.png"]} alt="Playing Card with Blue Back." />
    );
  }
};
export default Card;
