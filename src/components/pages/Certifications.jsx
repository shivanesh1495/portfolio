import React, { memo, useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { useGitHubCertifications } from "../../hooks/useGitHub";

const IMAGE_TYPES = new Set(["PNG", "JPG", "JPEG", "WEBP", "SVG"]);

function CertificateCard({ certification, index, duplicate = false }) {
  const isImage = IMAGE_TYPES.has(certification.type);

  return (
    <a
      className="certificate-row certificate-row--browser"
      href={certification.previewUrl || certification.url}
      target="_blank"
      rel="noreferrer"
      role={duplicate ? undefined : "listitem"}
      tabIndex={duplicate ? -1 : undefined}
      aria-hidden={duplicate || undefined}
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
}

function Certifications() {
  const { certifications, loading, error } = useGitHubCertifications();
  const visibleCertifications = useMemo(
    () => certifications.slice(0, 6),
    [certifications],
  );
  const canAutoScroll = visibleCertifications.length > 1;
  const scrollDuration = `${Math.min(
    Math.max(visibleCertifications.length * 7, 24),
    60,
  )}s`;

  const renderCertificateCards = (duplicate = false) =>
    visibleCertifications.map((certification, index) => (
      <CertificateCard
        key={`${duplicate ? "clone" : "primary"}-${certification.id}`}
        certification={certification}
        index={index}
        duplicate={duplicate}
      />
    ));

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
            className="certifications-browser"
            style={{ "--cert-scroll-duration": scrollDuration }}
          >
            <div className="certifications-browser__toolbar" aria-hidden="true">
              <div className="certifications-browser__actions">
                <span className="certifications-browser__dot certifications-browser__dot--close" />
                <span className="certifications-browser__dot certifications-browser__dot--minimize" />
                <span className="certifications-browser__dot certifications-browser__dot--expand" />
              </div>

              <div className="certifications-browser__address">
                portfolio.dev/certificates
              </div>

              <div className="certifications-browser__pill">
                {canAutoScroll ? "Auto scroll" : "Pinned preview"}
              </div>
            </div>

            <div className="certifications-browser__viewport">
              <div className="certifications-browser__page">
                <div className="certifications-browser__page-header">
                  <div className="certifications-browser__page-copy">
                    <span className="certifications-browser__eyebrow">
                      GitHub Synced
                    </span>
                    <h3>Certificate wall inside the mock browser.</h3>
                    <p>
                      The latest recognitions scroll through automatically while
                      keeping each card linked to its original document.
                    </p>
                  </div>

                  <div className="certifications-browser__stat">
                    <strong>
                      {String(visibleCertifications.length).padStart(2, "0")}
                    </strong>
                    <span>Latest certificates</span>
                  </div>
                </div>

                <div className="certifications-browser__marquee">
                  <div
                    className={`certifications-browser__track${
                      canAutoScroll
                        ? " certifications-browser__track--animated"
                        : ""
                    }`}
                  >
                    <div
                      className="certifications-strip certifications-strip--browser"
                      role="list"
                      aria-label="Highlighted certificates"
                    >
                      {renderCertificateCards()}
                    </div>

                    {canAutoScroll ? (
                      <div
                        className="certifications-strip certifications-strip--browser certifications-strip--clone"
                        aria-hidden="true"
                      >
                        {renderCertificateCards(true)}
                      </div>
                    ) : null}
                  </div>

                  {canAutoScroll ? (
                    <div className="certifications-browser__scrollbar" aria-hidden="true">
                      <span className="certifications-browser__scrollbar-thumb" />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(Certifications);
