import React, { memo } from "react";

const HangingBoard = memo(({ show }) => {
  if (!show) return null;

  return (
    <div className="hanging-board-container">
      <div className="hanging-board-rope hanging-board-rope--left" />
      <div className="hanging-board-rope hanging-board-rope--right" />
      <div className="hanging-board">
        <p className="hanging-board__text">
          Available for <span className="highlight">collaborations</span>,{" "}
          <span className="highlight">internships</span>, and thoughtful{" "}
          <span className="highlight">product work</span> where engineering
          craft matters.
        </p>
      </div>
    </div>
  );
});

export default HangingBoard;
