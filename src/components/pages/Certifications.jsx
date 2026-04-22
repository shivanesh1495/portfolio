import React, {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import { useGitHubCertifications } from "../../hooks/useGitHub";

const IMAGE_TYPES = new Set(["PNG", "JPG", "JPEG", "WEBP", "SVG"]);
const SLIDE_INTERVAL_MS = 3000;
const HOLD_THRESHOLD_MS = 180;
const PDF_PREVIEW_SIZE_STEP = 120;
const pdfPreviewMemoryCache = new Map();
const pdfPreviewPromiseCache = new Map();

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

function getPdfPreviewCacheKey(url, width, height) {
  const roundedWidth =
    Math.max(Math.round(width / PDF_PREVIEW_SIZE_STEP), 1) * PDF_PREVIEW_SIZE_STEP;
  const roundedHeight =
    Math.max(Math.round(height / PDF_PREVIEW_SIZE_STEP), 1) * PDF_PREVIEW_SIZE_STEP;

  return `${url}:${roundedWidth}x${roundedHeight}`;
}

async function renderPdfPreviewToImage(url, width, height) {
  const cacheKey = getPdfPreviewCacheKey(url, width, height);
  const cachedPreview = pdfPreviewMemoryCache.get(cacheKey);

  if (cachedPreview) {
    return cachedPreview;
  }

  const existingPromise = pdfPreviewPromiseCache.get(cacheKey);

  if (existingPromise) {
    return existingPromise;
  }

  const renderPromise = (async () => {
    let pdfDocument = null;

    try {
      const loadingTask = getDocument(url);
      pdfDocument = await loadingTask.promise;
      const page = await pdfDocument.getPage(1);
      const unscaledViewport = page.getViewport({ scale: 1 });
      const widthScale = width / unscaledViewport.width;
      const heightScale = height / unscaledViewport.height;
      const scale = Math.min(widthScale, heightScale);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Unable to create PDF preview context");
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderTask = page.render({ canvasContext: context, viewport });
      await renderTask.promise;

      const previewSrc = canvas.toDataURL("image/webp", 0.92);
      pdfPreviewMemoryCache.set(cacheKey, previewSrc);
      return previewSrc;
    } finally {
      pdfPreviewPromiseCache.delete(cacheKey);

      if (pdfDocument) {
        await pdfDocument.destroy().catch(() => {});
      }
    }
  })();

  pdfPreviewPromiseCache.set(cacheKey, renderPromise);
  return renderPromise;
}

function PdfCertificatePreview({ title, url, shouldRender }) {
  const stageRef = useRef(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    if (!shouldRender && !previewSrc) {
      return undefined;
    }

    let cancelled = false;
    async function renderPreview() {
      try {
        setRenderError(false);
        const stage = stageRef.current;

        if (!stage) {
          return;
        }

        const parentWidth = stage.clientWidth || 1200;
        const parentHeight = stage.clientHeight || 720;

        if (parentWidth < 40 || parentHeight < 40) {
          window.requestAnimationFrame(() => {
            if (!cancelled) {
              renderPreview();
            }
          });
          return;
        }

        const nextPreviewSrc = await renderPdfPreviewToImage(
          url,
          parentWidth,
          parentHeight,
        );

        if (!cancelled) {
          setPreviewSrc(nextPreviewSrc);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error rendering certificate PDF preview:", error);
          setRenderError(true);
        }
      }
    }

    renderPreview();

    return () => {
      cancelled = true;
    };
  }, [previewSrc, shouldRender, url]);

  if (renderError) {
    return (
      <div className="certificate-placeholder" aria-hidden="true">
        <strong>{title}</strong>
        <span>Preview unavailable</span>
      </div>
    );
  }

  if (!shouldRender && !previewSrc) {
    return (
      <div className="certificate-placeholder certificate-placeholder--loading" aria-hidden="true">
        <strong>{title}</strong>
        <span>Preparing preview</span>
      </div>
    );
  }

  if (previewSrc) {
    return (
      <img
        src={previewSrc}
        alt={title}
        className="certificate-pdf-image"
        loading="eager"
      />
    );
  }

  return <div ref={stageRef} className="certificate-pdf-stage" />;
}

function CertificateCard({ certification, index, shouldRenderPreview }) {
  const isImage = IMAGE_TYPES.has(certification.type);
  const isPdf = certification.type === "PDF";

  return (
    <div
      className="certificate-row certificate-row--browser"
      role="listitem"
      aria-label={`${certification.title} (${String(index + 1).padStart(2, "0")})`}
    >
      <div className="certificate-row__preview">
        {isImage ? (
          <div className="certificate-row__preview-stage">
            {shouldRenderPreview ? (
              <img
                src={certification.previewUrl}
                alt={certification.title}
                className="certificate-image"
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <div
                className="certificate-placeholder certificate-placeholder--loading"
                aria-hidden="true"
              >
                <strong>{certification.title}</strong>
                <span>Preparing preview</span>
              </div>
            )}
          </div>
        ) : isPdf ? (
          <div className="certificate-row__preview-stage certificate-row__preview-stage--document">
            <PdfCertificatePreview
              title={certification.title}
              shouldRender={shouldRenderPreview}
              url={certification.previewUrl}
            />
          </div>
        ) : (
          <div className="certificate-placeholder" aria-hidden="true">
            <strong>{certification.title}</strong>
            <span>Open document</span>
          </div>
        )}
      </div>
    </div>
  );
}

function CertificationsBrowser({ visibleCertifications }) {
  const canAutoScroll = visibleCertifications.length > 1;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const holdStartedAtRef = useRef(0);
  const suppressClickRef = useRef(false);
  const slides = useMemo(() => {
      if (!canAutoScroll) {
        return visibleCertifications;
      }

      return [...visibleCertifications, visibleCertifications[0]];
  }, [canAutoScroll, visibleCertifications]);
  const activePreviewIndex =
    visibleCertifications.length === 0
      ? 0
      : activeIndex % visibleCertifications.length;
  const preloadedIndexes = useMemo(() => {
    if (visibleCertifications.length === 0) {
      return new Set();
    }

    return new Set([
      activePreviewIndex,
      (activePreviewIndex + 1) % visibleCertifications.length,
      (activePreviewIndex - 1 + visibleCertifications.length) %
        visibleCertifications.length,
    ]);
  }, [activePreviewIndex, visibleCertifications.length]);

  useEffect(() => {
    if (!canAutoScroll || isTransitionEnabled) {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      setIsTransitionEnabled(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [canAutoScroll, isTransitionEnabled]);

  useEffect(() => {
    if (!canAutoScroll || isPaused || !isTransitionEnabled) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setActiveIndex((currentIndex) => currentIndex + 1);
    }, SLIDE_INTERVAL_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [activeIndex, canAutoScroll, isPaused, isTransitionEnabled]);

  const handlePressStart = (event) => {
    if (!canAutoScroll) {
      return;
    }

    holdStartedAtRef.current = window.performance.now();
    suppressClickRef.current = false;
    setIsPaused(true);

    if (event.currentTarget.setPointerCapture) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture can fail on some synthetic interactions. Pausing still works.
      }
    }
  };

  const handlePressEnd = () => {
    if (!canAutoScroll) {
      return;
    }

    const heldLongEnough =
      holdStartedAtRef.current > 0 &&
      window.performance.now() - holdStartedAtRef.current >= HOLD_THRESHOLD_MS;

    if (heldLongEnough) {
      suppressClickRef.current = true;

      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }

    holdStartedAtRef.current = 0;
    setIsPaused(false);
  };

  const handleTrackTransitionEnd = () => {
    if (!canAutoScroll || activeIndex !== visibleCertifications.length) {
      return;
    }

    setIsTransitionEnabled(false);
    setActiveIndex(0);
  };

  const handleCarouselClickCapture = (event) => {
    if (!suppressClickRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };

  const handleSelectSlide = (nextIndex) => {
    setIsTransitionEnabled(true);
    setActiveIndex(nextIndex);
  };

  const handleStep = (direction) => {
    if (!canAutoScroll) {
      return;
    }

    const nextIndex =
      (activePreviewIndex + direction + visibleCertifications.length) %
      visibleCertifications.length;

    handleSelectSlide(nextIndex);
  };

  return (
    <div
      className="certifications-browser"
      data-paused={isPaused ? "true" : "false"}
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
          {canAutoScroll
            ? isPaused
              ? "Paused"
              : "Hold to pause"
            : "Pinned preview"}
        </div>
      </div>

      <div className="certifications-browser__viewport">
        <div className="certifications-browser__page">
          <div className="certifications-browser__header">
            <div className="certifications-browser__meta">
              <span className="certifications-browser__eyebrow">Certificates</span>
            </div>

            <div className="certifications-browser__status">
              <span className="certifications-browser__counter">
                {String(activePreviewIndex + 1).padStart(2, "0")} /{" "}
                {String(visibleCertifications.length).padStart(2, "0")}
              </span>
              <span className="certifications-browser__mode">
                {isPaused ? "Paused" : "Auto"}
              </span>
            </div>
          </div>

          <div
            className="certifications-browser__carousel"
            onClickCapture={handleCarouselClickCapture}
            onPointerCancel={handlePressEnd}
            onPointerDown={handlePressStart}
            onPointerUp={handlePressEnd}
            onLostPointerCapture={handlePressEnd}
          >
            <div
              className="certifications-browser__track"
              onTransitionEnd={handleTrackTransitionEnd}
              style={{
                transform: `translate3d(-${activeIndex * 100}%, 0, 0)`,
                transition: isTransitionEnabled
                  ? "transform 0.72s var(--ease-smooth)"
                  : "none",
              }}
            >
              {slides.map((certification, index) => {
                const originalIndex =
                  visibleCertifications.length === 0
                    ? index
                    : index % visibleCertifications.length;
                const isCloneSlide =
                  canAutoScroll && index === slides.length - 1;
                const shouldRenderPreview = preloadedIndexes.has(originalIndex);

                return (
                  <div
                    key={`${certification.id}-${index}`}
                    className="certifications-browser__slide"
                    aria-hidden={isCloneSlide || undefined}
                  >
                    <div
                      className="certifications-strip certifications-strip--browser"
                      role={isCloneSlide ? undefined : "list"}
                      aria-label={isCloneSlide ? undefined : "Certificates"}
                    >
                      <CertificateCard
                        certification={certification}
                        index={originalIndex}
                        shouldRenderPreview={shouldRenderPreview}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="certifications-browser__footer">
            <div className="certifications-browser__controls">
              <button
                type="button"
                className="certifications-browser__nav"
                onClick={() => handleStep(-1)}
                aria-label="Previous certificate"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="certifications-browser__progress" aria-label="Carousel progress">
                {visibleCertifications.map((certification, index) => (
                  <button
                    key={certification.id}
                    type="button"
                    className={`certifications-browser__progress-dot${
                      activePreviewIndex === index
                        ? " certifications-browser__progress-dot--active"
                        : ""
                    }`}
                    onClick={() => handleSelectSlide(index)}
                    aria-label={`Show certificate ${index + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                className="certifications-browser__nav"
                onClick={() => handleStep(1)}
                aria-label="Next certificate"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <p className="certifications-browser__hint">
              Press and hold on the preview to pause the carousel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Certifications() {
  const { certifications, loading, error } = useGitHubCertifications();
  const visibleCertifications = useMemo(
    () => certifications.slice(0, 6),
    [certifications],
  );
  const carouselKey = useMemo(
    () => visibleCertifications.map((certification) => certification.id).join(":"),
    [visibleCertifications],
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
          <CertificationsBrowser
            key={carouselKey}
            visibleCertifications={visibleCertifications}
          />
        )}
      </div>
    </div>
  );
}

export default memo(Certifications);
