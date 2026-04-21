import React, { memo, useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { useGitHubCertifications } from "../../hooks/useGitHub";

const IMAGE_TYPES = new Set(["PNG", "JPG", "JPEG", "WEBP", "SVG"]);

function Certifications() {
  const { certifications, loading, error } = useGitHubCertifications();
  const visibleCertifications = useMemo(
    () => certifications.slice(0, 4),
    [certifications],
  );

  return (
    <div className="content-block">
      <header className="section-header">
        <h2 className="section-title-display">Certificates</h2>
        <p className="section-copy section-copy--muted">
          Recent recognitions synced from GitHub and kept lightweight on the
          page.
        </p>
      </header>

      {loading ? (
        <div className="section-card section-state">
          <p>Loading certificates...</p>
        </div>
      ) : error ? (
        <div className="section-card section-state section-state--error">
          <p>Error loading certifications: {error}</p>
        </div>
      ) : visibleCertifications.length === 0 ? (
        <div className="section-card section-state">
          <p>No certificates are available right now.</p>
        </div>
      ) : (
        <div className="certificate-grid">
          {visibleCertifications.map((certification) => {
            const isImage = IMAGE_TYPES.has(certification.type);

            return (
              <a
                key={certification.id}
                className="certificate-card"
                href={certification.previewUrl || certification.url}
                target="_blank"
                rel="noreferrer"
              >
                <div className="certificate-card__preview">
                  {isImage ? (
                    <img
                      src={certification.previewUrl}
                      alt={certification.title}
                      className="certificate-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="certificate-placeholder" aria-hidden="true">
                      <span className="certificate-type">{certification.type}</span>
                      <strong>{certification.title}</strong>
                      <span>Open document</span>
                    </div>
                  )}
                </div>

                <div className="certificate-card__meta">
                  <strong>{certification.title}</strong>
                  <span>
                    {certification.type} <ArrowUpRight size={15} />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default memo(Certifications);
