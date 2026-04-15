import React, { memo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { Search, ArrowUpRight, Calendar, Clock } from "lucide-react";
import { useGitHubWritings } from "../../hooks/useGitHub";
import { revealIn } from "../../utils/animations";

const FALLBACK_FILTERS = ["all"];

function Writings() {
  const { writings, loading, error } = useGitHubWritings();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filters = React.useMemo(() => {
    const stacks = new Set(FALLBACK_FILTERS);
    writings.forEach((item) => {
      (item.stacks || []).forEach((stack) =>
        stacks.add(String(stack).toLowerCase()),
      );
    });
    return Array.from(stacks).sort();
  }, [writings]);

  const normalizedQuery = React.useMemo(
    () => query.trim().toLowerCase(),
    [query],
  );

  const visible = React.useMemo(
    () =>
      writings.filter((a) => {
        const stacks = (a.stacks || []).map((stack) =>
          String(stack).toLowerCase(),
        );
        const tags = (a.tags || []).map((tag) => String(tag).toLowerCase());
        const haystack =
          `${a.title || ""} ${a.desc || ""} ${tags.join(" ")} ${stacks.join(" ")}`.toLowerCase();
        const matchesFilter = filter === "all" || stacks.includes(filter);
        const matchesQuery =
          !normalizedQuery || haystack.includes(normalizedQuery);
        return matchesFilter && matchesQuery;
      }),
    [writings, filter, normalizedQuery],
  );

  const container = useRef();

  useGSAP(
    () => {
      if (visible.length > 0) {
        revealIn(".article-card", {
          y: 15,
          duration: 0.5,
          stagger: 0.1,
        });
      }
    },
    { dependencies: [visible], scope: container },
  );

  return (
    <div className="writings-page" ref={container}>
      <div className="page-header">
        <h1 className="writings-hero-heading">
          <span className="solid">LATEST</span>
          <span className="ghost">WRITINGS</span>
        </h1>
        <p className="page-subtitle">
          Notes on systems, backend engineering, and implementation lessons from
          real builds.
        </p>
      </div>

      <div className="search-bar">
        <Search size={17} color="var(--text-muted)" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, tags, or topics"
        />
      </div>

      <div className="filter-chips">
        {filters.map((f) => (
          <button
            key={f}
            className={`chip${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Loading writings from GitHub...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>Error loading writings: {error}</p>
        </div>
      ) : (
        <div className="articles-list">
          {visible.map((a, i) => (
            <div className="article-card" key={a.id || a.slug || i}>
              <div className="article-top">
                <h3>{a.title}</h3>
                <ArrowUpRight size={17} className="card-arrow" />
              </div>
              <p>{a.desc}</p>
              <div className="article-tags">
                {(a.tags || []).map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              <div className="article-meta">
                <span>
                  <Calendar size={13} /> {a.date}
                </span>
                <span>
                  <Clock size={13} /> {a.read}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(Writings);
