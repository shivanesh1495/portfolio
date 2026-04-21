import React, { memo, useMemo } from "react";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import { useGitHubWritings } from "../../hooks/useGitHub";

function Writings() {
  const { writings, loading, error } = useGitHubWritings();
  const latestWritings = useMemo(() => writings.slice(0, 3), [writings]);

  return (
    <div className="content-block">
      <header className="section-header">
        <h2 className="section-title-display">Latest</h2>
        <p className="section-copy section-copy--muted">
          Notes on systems, backend engineering, and implementation lessons from
          real builds.
        </p>
      </header>

      {loading ? (
        <div className="section-card section-state">
          <p>Loading writings from GitHub...</p>
        </div>
      ) : error ? (
        <div className="section-card section-state section-state--error">
          <p>Error loading writings: {error}</p>
        </div>
      ) : latestWritings.length === 0 ? (
        <div className="section-card section-state">
          <p>No writings are available right now.</p>
        </div>
      ) : (
        <div className="writing-list">
          {latestWritings.map((item, index) => {
            const articleHref = item.url || item.link || item.href;

            return (
              <article
                className="section-card section-card--tight"
                key={item.id || item.slug || index}
              >
                <div className="writing-card__top">
                  <h3>{item.title}</h3>
                  {articleHref ? <ArrowUpRight size={18} className="card-arrow" /> : null}
                </div>

                <p className="writing-card__copy">{item.desc}</p>

                <div className="tag-row">
                  {(item.tags || []).slice(0, 4).map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="meta-row">
                  {item.date ? (
                    <span>
                      <Calendar size={13} /> {item.date}
                    </span>
                  ) : null}
                  {item.read ? (
                    <span>
                      <Clock size={13} /> {item.read}
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
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default memo(Writings);
