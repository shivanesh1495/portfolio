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
    <div className="scene scene--certifications">
      <div className="scene__rail" aria-hidden="true">
        <span className="scene__index">04</span>
        <span className="scene__line" />
      </div>

      <div className="scene__body">
        <header className="scene__header">
          <div className="scene__intro">
            <h2 className="section-title-display">Certificates</h2>
            <p className="scene__description">
              Recent recognitions synced from GitHub and surfaced with a lighter
              editorial layout.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="scene-state">
            <p>Loading certificates...</p>
          </div>
        ) : error ? (
          <div className="scene-state section-state--error">
            <p>Error loading certifications: {error}</p>
          </div>
        ) : visibleCertifications.length === 0 ? (
          <div className="scene-state">
            <p>No certificates are available right now.</p>
          </div>
        ) : (
          <div
            className="certifications-strip"
            role="list"
            aria-label="Highlighted certificates"
          >
            {visibleCertifications.map((certification, index) => {
              const isImage = IMAGE_TYPES.has(certification.type);

              return (
                <a
                  key={certification.id}
                  className="certificate-row"
                  href={certification.previewUrl || certification.url}
                  target="_blank"
                  rel="noreferrer"
                  role="listitem"
                >
                  <div className="certificate-row__eyebrow">
                    <span className="certificate-row__index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="certificate-type">{certification.type}</span>
                  </div>

                  <div className="certificate-row__preview">
                    {isImage ? (
                      <img
                        src={certification.previewUrl}
                        alt={certification.title}
                        className="certificate-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="certificate-placeholder" aria-hidden="true">
                        <strong>{certification.title}</strong>
                        <span>Open document</span>
                      </div>
                    )}
                  </div>

                  <div className="certificate-row__footer">
                    <div className="certificate-row__copy">
                      <strong>{certification.title}</strong>
                      <span>Open document</span>
                    </div>
                    <ArrowUpRight size={16} className="certificate-row__arrow" />
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(Certifications);
