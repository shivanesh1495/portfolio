import React, { memo, useMemo, useState } from "react";
import { Search, ArrowUpRight, Calendar, Clock } from "lucide-react";
import { useGitHubWritings } from "../../hooks/useGitHub";

const FALLBACK_FILTERS = ["all"];

function Writings() {
  const { writings, loading, error } = useGitHubWritings();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filters = useMemo(() => {
    const stacks = new Set(FALLBACK_FILTERS);
    writings.forEach((item) => {
      (item.stacks || []).forEach((stack) =>
        stacks.add(String(stack).toLowerCase()),
      );
    });
    return Array.from(stacks).sort();
  }, [writings]);

  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);

  const visible = useMemo(
    () =>
      writings.filter((item) => {
        const stacks = (item.stacks || []).map((stack) =>
          String(stack).toLowerCase(),
        );
        const tags = (item.tags || []).map((tag) => String(tag).toLowerCase());
        const haystack =
          `${item.title || ""} ${item.desc || ""} ${tags.join(" ")} ${stacks.join(" ")}`.toLowerCase();
        const matchesFilter = filter === "all" || stacks.includes(filter);
        const matchesQuery =
          !normalizedQuery || haystack.includes(normalizedQuery);
        return matchesFilter && matchesQuery;
      }),
    [writings, filter, normalizedQuery],
  );

  return (
    <div className="writings-page">
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
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search title, tags, or topics"
        />
      </div>

      <div className="filter-chips">
        {filters.map((item) => (
          <button
            key={item}
            className={`chip${filter === item ? " active" : ""}`}
            onClick={() => setFilter(item)}
          >
            {item}
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
          {visible.map((item, index) => (
            <div className="article-card" key={item.id || item.slug || index}>
              <div className="article-top">
                <h3>{item.title}</h3>
                <ArrowUpRight size={17} className="card-arrow" />
              </div>
              <p>{item.desc}</p>
              <div className="article-tags">
                {(item.tags || []).map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="article-meta">
                <span>
                  <Calendar size={13} /> {item.date}
                </span>
                <span>
                  <Clock size={13} /> {item.read}
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
