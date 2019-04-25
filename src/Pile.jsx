import React from "react";
import Card from "./Card";

// represents a pile of cards
// cards will be stacked on top of each other
const Pile = ({ cards }) => (
  <div className="border-white border-2 rounded w-32 h-48">
    <Card card={cards[0] || []} />{" "}
  </div>
);
export default Pile;
