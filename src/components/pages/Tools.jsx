import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { createPortal } from "react-dom";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import { CertificateSVG } from "../icons/BrandIcons";
import { useGitHubCertifications } from "../../hooks/useGitHub";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const pdfDocumentCache = new Map();

async function loadPdfDocument(url) {
  if (pdfDocumentCache.has(url)) {
    return pdfDocumentCache.get(url);
  }

  const loadingTask = getDocument({ url });
  const documentPromise = loadingTask.promise.catch((error) => {
    pdfDocumentCache.delete(url);
    throw error;
  });

  pdfDocumentCache.set(url, documentPromise);
  return documentPromise;
}

function PdfPreview({ url, mode = "cover" }) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;

    if (!wrapper || !canvas) {
      return undefined;
    }

    let disposed = false;
    let renderToken = 0;

    const renderPage = async () => {
      const currentWrapper = wrapperRef.current;
      const currentCanvas = canvasRef.current;

      if (!currentWrapper || !currentCanvas) {
        return;
      }

      const rect = currentWrapper.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        return;
      }

      const token = ++renderToken;
      setStatus("loading");

      try {
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
          renderTaskRef.current = null;
        }

        const pdfDocument = await loadPdfDocument(url);

        if (disposed || token !== renderToken) {
          return;
        }

        const page = await pdfDocument.getPage(1);
        if (disposed || token !== renderToken) {
          return;
        }

        const baseViewport = page.getViewport({ scale: 1 });
        const scale =
          mode === "cover"
            ? Math.max(
                rect.width / baseViewport.width,
                rect.height / baseViewport.height,
              )
            : Math.min(
                rect.width / baseViewport.width,
                rect.height / baseViewport.height,
              );
        const viewport = page.getViewport({ scale });
        const devicePixelRatio = window.devicePixelRatio || 1;

        currentCanvas.width = Math.floor(viewport.width * devicePixelRatio);
        currentCanvas.height = Math.floor(viewport.height * devicePixelRatio);
        currentCanvas.style.width = `${viewport.width}px`;
        currentCanvas.style.height = `${viewport.height}px`;

        const context = currentCanvas.getContext("2d", { alpha: false });
        if (!context) {
          throw new Error("Canvas context unavailable");
        }

        context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, viewport.width, viewport.height);

        const renderTask = page.render({
          canvasContext: context,
          viewport,
        });
        renderTaskRef.current = renderTask;
        await renderTask.promise;

        if (disposed || token !== renderToken) {
          return;
        }

        setStatus("ready");
      } catch {
        if (!disposed) {
          setStatus("error");
        }
      }
    };

    const handleResize = () => {
      renderPage();
    };

    let resizeObserver = null;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(wrapper);
    } else {
      window.addEventListener("resize", handleResize);
    }

    renderPage();

    return () => {
      disposed = true;
      renderToken += 1;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, [mode, url]);

  return (
    <div ref={wrapperRef} className="cert-preview">
      <canvas ref={canvasRef} className="cert-preview-canvas" />
      {status === "error" ? (
        <div className="cert-preview-fallback" aria-hidden="true">
          <div className="cert-icon-wrap">
            <CertificateSVG />
          </div>
          <span>Preview unavailable</span>
        </div>
      ) : null}
    </div>
  );
}

export default function Certifications() {
  const modalOverlayRef = useRef(null);
  const modalPanelRef = useRef(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [selectedRect, setSelectedRect] = useState(null);
  const { certifications, loading, error } = useGitHubCertifications();

  const openCertification = useCallback((cert, element) => {
    if (!element) return;

    setSelectedRect(element.getBoundingClientRect());
    setSelectedCert(cert);
  }, []);

  const closeCertification = useCallback(() => {
    if (!selectedCert || !selectedRect || !modalPanelRef.current) {
      setSelectedCert(null);
      setSelectedRect(null);
      return;
    }

    const shell = modalPanelRef.current;
    const overlay = modalOverlayRef.current;

    gsap.killTweensOf([shell, overlay]);

    const timeline = gsap.timeline({
      onComplete: () => {
        setSelectedCert(null);
        setSelectedRect(null);
      },
    });

    timeline.to(overlay, {
      opacity: 0,
      duration: 0.22,
      ease: "power2.in",
    });

    timeline.to(
      shell,
      {
        left: selectedRect.left,
        top: selectedRect.top,
        width: selectedRect.width,
        height: selectedRect.height,
        xPercent: 0,
        yPercent: 0,
        borderRadius: 22,
        duration: 0.48,
        ease: "power3.inOut",
      },
      0,
    );
  }, [selectedCert, selectedRect]);

  useLayoutEffect(() => {
    if (
      !selectedCert ||
      !selectedRect ||
      !modalOverlayRef.current ||
      !modalPanelRef.current
    ) {
      return undefined;
    }

    const shell = modalPanelRef.current;
    const overlay = modalOverlayRef.current;
    const modalWidth = Math.min(window.innerWidth * 0.92, 1160);
    const modalHeight = Math.min(window.innerHeight * 0.88, 880);

    gsap.killTweensOf([shell, overlay]);
    gsap.set(overlay, { opacity: 0 });
    gsap.set(shell, {
      left: selectedRect.left,
      top: selectedRect.top,
      width: selectedRect.width,
      height: selectedRect.height,
      xPercent: 0,
      yPercent: 0,
      borderRadius: 22,
    });

    const timeline = gsap.timeline();

    timeline.to(overlay, {
      opacity: 1,
      duration: 0.22,
      ease: "power2.out",
    });

    timeline.to(
      shell,
      {
        left: "50%",
        top: "50%",
        width: modalWidth,
        height: modalHeight,
        xPercent: -50,
        yPercent: -50,
        borderRadius: 28,
        duration: 0.62,
        ease: "power3.out",
      },
      0,
    );

    return () => {
      timeline.kill();
    };
  }, [selectedCert, selectedRect]);

  useEffect(() => {
    if (!selectedCert) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closeCertification();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeCertification, selectedCert]);

  return (
    <div className="certifications-page">
      <div className="page-header">
        <h1 className="certifications-hero-heading">
          <span className="solid">CERTIFICATES &</span>
          <span className="ghost">RECOGNITIONS</span>
        </h1>
        <p className="page-subtitle">
          Certificates synced live from GitHub. Tap a card to expand the preview
          in place.
        </p>
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Loading certifications from GitHub...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>Error loading certifications: {error}</p>
        </div>
      ) : (
        <div className="certifications-grid">
          {certifications.map((cert) => (
            <button
              type="button"
              className="cert-card"
              key={cert.id}
              onClick={(event) => openCertification(cert, event.currentTarget)}
              aria-label="Open certificate preview"
            >
              <PdfPreview url={cert.previewUrl} mode="cover" />
            </button>
          ))}
        </div>
      )}

      {selectedCert && typeof document !== "undefined"
        ? createPortal(
            <div
              className="cert-modal-overlay"
              ref={modalOverlayRef}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  closeCertification();
                }
              }}
            >
              <div className="cert-modal-shell" ref={modalPanelRef}>
                <button
                  type="button"
                  className="cert-modal-close"
                  onClick={closeCertification}
                  aria-label="Close certificate preview"
                >
                  ×
                </button>
                <PdfPreview url={selectedCert.previewUrl} mode="contain" />
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
