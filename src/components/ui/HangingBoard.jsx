import React, { memo } from "react";

const HangingBoard = memo(() => {
  return (
    <div className="hanging-board-container">
      <div className="hanging-board-rope hanging-board-rope--left" />
      <div className="hanging-board-rope hanging-board-rope--right" />
      <div className="hanging-board">
        <p className="hanging-board__text">
          Available for collaborations, internships, and thoughtful product work
          where engineering craft matters.
        </p>
      </div>
    </div>
  );
});

export default HangingBoard;
