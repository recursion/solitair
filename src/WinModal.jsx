import React from "react";

const WinModal = ({ restart }) => (
  <div className="fixed pin-t pin-l h-screen w-full flex flex-col items-center justify-center font-sans">
    <div className="h-screen w-full absolute flex items-center justify-center bg-modal">
      <div className="bg-white border border-blue rounded shadow p-8 m-4 max-w-xs max-h-full text-center overflow-y-hidden">
        <div className="mb-4">
          <h1>Winner Winner!</h1>
        </div>
        <div className="mb-8">
          <p>Chicken Dinner!</p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={restart}
            className="flex-no-shrink text-white py-2 px-4 rounded bg-teal hover:bg-teal-dark"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default WinModal;
