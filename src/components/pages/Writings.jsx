import React, { memo, useMemo } from "react";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import { useGitHubWritings } from "../../hooks/useGitHub";
import { useInView } from "../../hooks/useInView";

function Writings() {
  const { writings, loading, error } = useGitHubWritings();
  const { targetRef, isInView } = useInView();
  const marqueeWritings = useMemo(() => {
    if (writings.length === 0) {
      return [];
    }

    const visibleWritings = writings.slice(0, 6);
    const copyCount = visibleWritings.length === 1 ? 4 : 2;

    return Array.from({ length: copyCount }, () => visibleWritings).flat();
  }, [writings]);

  return (
    <div className="scene scene--latest">
      <div className="scene__rail" aria-hidden="true">
        <span className="scene__index">05</span>
        <span className="scene__line" />
      </div>

      <div className="scene__body">
        <header className="scene__header">
          <div className="scene__intro">
            <h2 className="section-title-display">Writings</h2>
            <p className="scene__description">
              Notes on systems, backend engineering, and implementation lessons
              from real builds.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="scene-state">
            <p>Loading writings...</p>
          </div>
        ) : error ? (
          <div className="scene-state section-state--error">
            <p>Error loading writings: {error}</p>
          </div>
        ) : marqueeWritings.length === 0 ? (
          <div className="scene-state">
            <p>No writings are available right now.</p>
          </div>
        ) : (
          <div
            className={`writings-marquee${isInView ? " is-active" : ""}`}
            ref={targetRef}
            aria-label="Writing archive"
          >
            <div className="writings-marquee__track">
              {marqueeWritings.map((writing, index) => {
                const articleHref =
                  writing.url || writing.link || writing.href || null;
                const displayIndex =
                  (index % Math.max(writings.slice(0, 6).length, 1)) + 1;
                const content = (
                  <>
                    <span className="writing-row__index">
                      {String(displayIndex).padStart(2, "0")}
                    </span>

                    <div className="writing-row__content">
                      <div className="writing-row__top">
                        <h3>{writing.title}</h3>
                        {articleHref ? (
                          <ArrowUpRight
                            size={18}
                            className="writing-row__arrow"
                          />
                        ) : null}
                      </div>

                      <p className="writing-row__copy">{writing.desc}</p>

                      <div className="tag-row">
                        {(writing.tags || []).slice(0, 4).map((tag) => (
                          <span key={`${writing.id}-${tag}`} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="writing-row__meta">
                        {writing.date ? (
                          <span>
                            <Calendar size={13} /> {writing.date}
                          </span>
                        ) : null}
                        {writing.read ? (
                          <span>
                            <Clock size={13} /> {writing.read}
                          </span>
                        ) : null}
                      </div>

                      <span className="writing-row__cta">
                        {articleHref ? "Read article" : "Editorial note"}
                      </span>
                    </div>
                  </>
                );

                return articleHref ? (
                  <a
                    href={articleHref}
                    target="_blank"
                    rel="noreferrer"
                    className="writing-row"
                    key={`${writing.id}-${index}`}
                    aria-label={`Open article: ${writing.title}`}
                  >
                    {content}
                  </a>
                ) : (
                  <article
                    className="writing-row"
                    key={`${writing.id}-${index}`}
                  >
                    {content}
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(Writings);
