import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { createPortal } from "react-dom";

import { CertificateSVG } from "../icons/BrandIcons";
import { useGitHubCertifications } from "../../hooks/useGitHub";

export default function Certifications() {
  const container = useRef();
  const modalOverlayRef = useRef(null);
  const modalPanelRef = useRef(null);
  const activeCardRef = useRef(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [selectedRect, setSelectedRect] = useState(null);
  const { certifications, loading, error } = useGitHubCertifications();

  const openCertification = (cert, element) => {
    if (!element) return;

    activeCardRef.current = element;
    setSelectedRect(element.getBoundingClientRect());
    setSelectedCert(cert);
  };

  const closeCertification = () => {
    if (!selectedCert || !selectedRect || !modalPanelRef.current) {
      setSelectedCert(null);
      setSelectedRect(null);
      activeCardRef.current = null;
      return;
    }

    const shell = modalPanelRef.current;
    const overlay = modalOverlayRef.current;

    gsap.killTweensOf([shell, overlay]);

    const timeline = gsap.timeline({
      onComplete: () => {
        setSelectedCert(null);
        setSelectedRect(null);
        activeCardRef.current = null;
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
  };

  useGSAP(
    () => {
      if (!loading && certifications.length > 0) {
        gsap.from(".cert-card", {
          opacity: 0,
          scale: 0.96,
          y: 18,
          duration: 0.45,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "all",
        });
      }
    },
    { dependencies: [certifications, loading], scope: container },
  );

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

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closeCertification();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedCert, selectedRect]);

  return (
    <div className="certifications-page" ref={container}>
      <div className="page-header">
        <h1 className="certifications-hero-heading">
          <span className="solid">CERTIFIED</span>
          <span className="ghost">CREDENTIALS</span>
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
              aria-label={`Open ${cert.title} certificate preview`}
            >
              <div className="cert-preview">
                <iframe
                  className="cert-preview-frame"
                  src={cert.previewUrl}
                  title={cert.title}
                />
                <div className="cert-preview-fade" />
                <span className="cert-preview-badge">Open preview</span>
                <div className="cert-preview-fallback" aria-hidden="true">
                  <div className="cert-icon-wrap">
                    <CertificateSVG />
                  </div>
                  <span>Preview unavailable</span>
                </div>
              </div>
              <ArrowUpRight size={17} className="cert-arrow" />
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
                <div className="cert-modal-preview">
                  <iframe
                    className="cert-modal-frame"
                    src={selectedCert.previewUrl}
                    title={selectedCert.title}
                  />
                </div>
                <div className="cert-modal-footer">
                  <div>
                    <span className="cert-modal-kicker">
                      {selectedCert.type} certificate
                    </span>
                    <h2>{selectedCert.title}</h2>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
