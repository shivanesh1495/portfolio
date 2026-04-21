import React, { memo } from "react";
import TechTicker from "../ui/TechTicker";

function StackSection() {
  return (
    <div className="scene scene--stack">
      <div className="scene__rail" aria-hidden="true">
        <span className="scene__index">06</span>
        <span className="scene__line" />
      </div>

      <div className="scene__body">
        <header className="scene__header">
          <div className="scene__intro">
            <h2 className="section-title-serif">Stack</h2>
            <p className="scene__description">
              Daily tools across product engineering, cloud workflows, and
              systems-oriented builds.
            </p>
          </div>
        </header>

        <div className="stack-stage">
          <div className="stack-floor" aria-hidden="true" />
          <TechTicker />
        </div>
      </div>
    </div>
  );
}

export default memo(StackSection);
