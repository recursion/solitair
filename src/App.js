import React from "react";
import { images } from "./images.js";
import Table from "./Table";
import * as cards from "./solitaire";

window.cards = cards;
/*
  <>
    <img src={images["AH.png"]} alt="Playing Card" width="5%" height="5%" />
    <h1>Hi!</h1>
  </>
*/

function App() {
  return <Table />;
}

export default App;
