import React, { memo, useMemo } from "react";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import { useGitHubWritings } from "../../hooks/useGitHub";

function Writings() {
  const { writings, loading, error } = useGitHubWritings();
  const latestWriting = useMemo(() => writings[0] ?? null, [writings]);
  const articleHref =
    latestWriting?.url || latestWriting?.link || latestWriting?.href;

  return (
    <div className="scene scene--latest">
      <div className="scene__rail" aria-hidden="true">
        <span className="scene__index">05</span>
        <span className="scene__line" />
      </div>

      <div className="scene__body">
        <header className="scene__header">
          <div className="scene__intro">
            <h2 className="section-title-display">Latest</h2>
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
        ) : !latestWriting ? (
          <div className="scene-state">
            <p>No writings are available right now.</p>
          </div>
        ) : (
          <article className="latest-feature">
            <div className="latest-feature__mesh" aria-hidden="true" />

            <div className="latest-feature__content">
              <div className="writing-card__top">
                <h3>{latestWriting.title}</h3>
              </div>

              <p className="writing-card__copy">{latestWriting.desc}</p>

              <div className="tag-row">
                {(latestWriting.tags || []).slice(0, 4).map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="meta-row">
                {latestWriting.date ? (
                  <span>
                    <Calendar size={13} /> {latestWriting.date}
                  </span>
                ) : null}
                {latestWriting.read ? (
                  <span>
                    <Clock size={13} /> {latestWriting.read}
                  </span>
                ) : null}
              </div>

              {articleHref ? (
                <a
                  className="section-link"
                  href={articleHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read article
                </a>
              ) : null}
            </div>

            {articleHref ? (
              <a
                className="latest-feature__action"
                href={articleHref}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open article: ${latestWriting.title}`}
              >
                <ArrowUpRight size={18} />
              </a>
            ) : null}
          </article>
        )}
      </div>
    </div>
  );
}

export default memo(Writings);
