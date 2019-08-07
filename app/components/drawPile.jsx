import React from "react";

export default function DrawPile({ cards }) {
  return <button className="pa3 br1 ba f4 fw2 tracked ttu ml1 gray pointer">Deck ({cards.length})</button>
}
