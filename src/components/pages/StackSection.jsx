import React, { memo } from "react";
import TechTicker from "../ui/TechTicker";

function StackSection() {
  return (
    <div className="content-block">
      <article className="section-card">
        <h2 className="section-title-serif">Stack</h2>
        <p className="section-copy section-copy--muted">
          Daily tools across product engineering, cloud workflows, and
          systems-oriented builds.
        </p>
        <TechTicker />
      </article>
    </div>
  );
}

export default memo(StackSection);
