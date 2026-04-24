import { memo, useState } from "react";

function TextHoverEffect({ text, className = "" }) {
  const [pointer, setPointer] = useState({
    x: 50,
    y: 50,
    active: false,
  });

  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const nextX = ((event.clientX - bounds.left) / Math.max(bounds.width, 1)) * 100;
    const nextY =
      ((event.clientY - bounds.top) / Math.max(bounds.height, 1)) * 100;

    setPointer({
      x: Math.min(100, Math.max(0, nextX)),
      y: Math.min(100, Math.max(0, nextY)),
      active: true,
    });
  };

  const handlePointerLeave = () => {
    setPointer({
      x: 50,
      y: 50,
      active: false,
    });
  };

  return (
    <p
      className={`text-hover-effect${className ? ` ${className}` : ""}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        "--hover-x": `${pointer.x}%`,
        "--hover-y": `${pointer.y}%`,
        "--hover-opacity": pointer.active ? 1 : 0.4,
      }}
    >
      <span className="text-hover-effect__layer text-hover-effect__outline" aria-hidden="true">
        {text}
      </span>
      <span className="text-hover-effect__layer text-hover-effect__base">
        {text}
      </span>
      <span className="text-hover-effect__layer text-hover-effect__fill" aria-hidden="true">
        {text}
      </span>
    </p>
  );
}

export default memo(TextHoverEffect);
