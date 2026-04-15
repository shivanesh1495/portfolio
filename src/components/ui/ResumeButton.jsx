import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useGitHubResume } from "../../hooks/useGitHub";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const resumePdfCache = new Map();

async function loadResumePdf(url) {
  if (resumePdfCache.has(url)) {
    return resumePdfCache.get(url);
  }

  const loadingTask = getDocument({ url });
  const documentPromise = loadingTask.promise.catch((error) => {
    resumePdfCache.delete(url);
    throw error;
  });

  resumePdfCache.set(url, documentPromise);
  return documentPromise;
}

function ResumePdfPreview({ url }) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;

    if (!wrapper || !canvas || !url) {
      return undefined;
    }

    let disposed = false;
    let token = 0;

    const render = async () => {
      const currentWrapper = wrapperRef.current;
      const currentCanvas = canvasRef.current;
      if (!currentWrapper || !currentCanvas) {
        return;
      }

      const rect = currentWrapper.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        return;
      }

      const run = ++token;

      try {
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
          renderTaskRef.current = null;
        }

        const pdfDocument = await loadResumePdf(url);
        if (disposed || run !== token) {
          return;
        }

        const page = await pdfDocument.getPage(1);
        if (disposed || run !== token) {
          return;
        }

        const baseViewport = page.getViewport({ scale: 1 });
        const scale = Math.min(
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
          return;
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
      } catch {
        // Keep silent fallback for malformed or unavailable PDFs.
      }
    };

    const onResize = () => render();
    let resizeObserver = null;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => onResize());
      resizeObserver.observe(wrapper);
    } else {
      window.addEventListener("resize", onResize);
    }

    render();

    return () => {
      disposed = true;
      token += 1;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", onResize);
      }
    };
  }, [url]);

  return (
    <div ref={wrapperRef} className="resume-preview">
      <canvas ref={canvasRef} className="resume-preview-canvas" />
    </div>
  );
}

export default function ResumeButton() {
  const buttonRef = useRef(null);
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const [originRect, setOriginRect] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { resume, loading } = useGitHubResume();

  const openResume = () => {
    if (!buttonRef.current || loading || !resume) {
      return;
    }

    setOriginRect(buttonRef.current.getBoundingClientRect());
    setIsOpen(true);
  };

  const closeResume = () => {
    if (!panelRef.current) {
      setIsOpen(false);
      setOriginRect(null);
      return;
    }

    const targetRect = buttonRef.current?.getBoundingClientRect() || originRect;
    if (!targetRect) {
      setIsOpen(false);
      setOriginRect(null);
      return;
    }

    const panel = panelRef.current;
    const overlay = overlayRef.current;

    gsap.killTweensOf([panel, overlay]);

    const timeline = gsap.timeline({
      defaults: {
        ease: "power2.out",
        overwrite: "auto",
      },
      onComplete: () => {
        setIsOpen(false);
        setOriginRect(null);
      },
    });

    timeline.to(overlay, {
      opacity: 0,
      duration: 0.16,
    });

    timeline.to(
      panel,
      {
        left: targetRect.left,
        top: targetRect.top,
        width: targetRect.width,
        height: targetRect.height,
        xPercent: 0,
        yPercent: 0,
        borderRadius: 22,
        scale: 0.97,
        opacity: 0.88,
        duration: 0.3,
        ease: "power2.inOut",
      },
      0,
    );
  };

  useLayoutEffect(() => {
    if (!isOpen || !originRect || !overlayRef.current || !panelRef.current) {
      return undefined;
    }

    const panel = panelRef.current;
    const overlay = overlayRef.current;
    const modalWidth = Math.min(window.innerWidth * 0.92, 1120);
    const modalHeight = Math.min(window.innerHeight * 0.9, 860);

    gsap.killTweensOf([panel, overlay]);
    gsap.set(overlay, { opacity: 0 });
    gsap.set(panel, {
      left: originRect.left,
      top: originRect.top,
      width: originRect.width,
      height: originRect.height,
      xPercent: 0,
      yPercent: 0,
      borderRadius: 22,
      opacity: 0,
      scale: 0.96,
      transformOrigin: "center center",
    });

    const timeline = gsap.timeline({
      defaults: {
        ease: "power2.out",
        overwrite: "auto",
      },
    });
    timeline.to(overlay, {
      opacity: 1,
      duration: 0.18,
    });
    timeline.to(
      panel,
      {
        left: "50%",
        top: "50%",
        width: modalWidth,
        height: modalHeight,
        xPercent: -50,
        yPercent: -50,
        borderRadius: 28,
        opacity: 1,
        scale: 1,
        duration: 0.42,
        ease: "power2.out",
      },
      0.02,
    );

    return () => timeline.kill();
  }, [isOpen, originRect]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closeResume();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, originRect]);

  return (
    <>
      <button
        className="Documents-btn"
        id="sidebar-resume-btn"
        ref={buttonRef}
        type="button"
        onClick={openResume}
        disabled={loading || !resume}
      >
        <div className="button-outer">
          <div className="button-inner">
            <span className="folderContainer">
              <svg
                className="fileBack"
                width="146"
                height="113"
                viewBox="0 0 146 113"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 4C0 1.79086 1.79086 0 4 0H50.3802C51.8285 0 53.2056 0.627965 54.1553 1.72142L64.3303 13.4371C65.2799 14.5306 66.657 15.1585 68.1053 15.1585H141.509C143.718 15.1585 145.509 16.9494 145.509 19.1585V109C145.509 111.209 143.718 113 141.509 113H3.99999C1.79085 113 0 111.209 0 109V4Z"
                  fill="url(#paint0_linear_117_4)"
                ></path>
                <defs>
                  <linearGradient
                    id="paint0_linear_117_4"
                    x1="0"
                    y1="0"
                    x2="72.93"
                    y2="95.4804"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="var(--resume-folder-back-start)"></stop>
                    <stop
                      offset="1"
                      stopColor="var(--resume-folder-back-end)"
                    ></stop>
                  </linearGradient>
                </defs>
              </svg>
              <svg
                className="filePage"
                width="88"
                height="99"
                viewBox="0 0 88 99"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="88"
                  height="99"
                  fill="url(#paint0_linear_117_6)"
                ></rect>
                <defs>
                  <linearGradient
                    id="paint0_linear_117_6"
                    x1="0"
                    y1="0"
                    x2="81"
                    y2="160.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="var(--resume-page-start)"></stop>
                    <stop offset="1" stopColor="var(--resume-page-end)"></stop>
                  </linearGradient>
                </defs>
              </svg>

              <svg
                className="fileFront"
                width="160"
                height="79"
                viewBox="0 0 160 79"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.29306 12.2478C0.133905 9.38186 2.41499 6.97059 5.28537 6.97059H30.419H58.1902C59.5751 6.97059 60.9288 6.55982 62.0802 5.79025L68.977 1.18034C70.1283 0.410771 71.482 0 72.8669 0H77H155.462C157.87 0 159.733 2.1129 159.43 4.50232L150.443 75.5023C150.19 77.5013 148.489 79 146.474 79H7.78403C5.66106 79 3.9079 77.3415 3.79019 75.2218L0.29306 12.2478Z"
                  fill="url(#paint0_linear_117_5)"
                ></path>
                <defs>
                  <linearGradient
                    id="paint0_linear_117_5"
                    x1="38.7619"
                    y1="8.71323"
                    x2="66.9106"
                    y2="82.8317"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="var(--resume-folder-front-start)"></stop>
                    <stop
                      offset="1"
                      stopColor="var(--resume-folder-front-end)"
                    ></stop>
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="text">Resume</span>
          </div>
        </div>
      </button>

      {isOpen && resume && typeof document !== "undefined"
        ? createPortal(
            <div
              className="resume-modal-overlay"
              ref={overlayRef}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  closeResume();
                }
              }}
            >
              <div className="resume-modal-shell" ref={panelRef}>
                <button
                  type="button"
                  className="resume-modal-close"
                  onClick={closeResume}
                  aria-label="Close resume preview"
                >
                  ×
                </button>
                <ResumePdfPreview url={resume.previewUrl} />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
