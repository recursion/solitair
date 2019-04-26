import React from "react";
import Table from "./Table";
import * as cards from "./solitaire";

window.cards = cards;

function App() {
  return <Table />;
}

export default App;
