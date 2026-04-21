import React, { memo } from "react";
import { ArrowUpRight } from "lucide-react";
import { useGitHubResume } from "../../hooks/useGitHub";

function ResumeButton() {
  const { resume, loading } = useGitHubResume();

  if (loading) {
    return (
      <span className="action-button action-button--muted" aria-disabled="true">
        Loading resume
      </span>
    );
  }

  if (!resume) {
    return (
      <span className="action-button action-button--muted" aria-disabled="true">
        Resume unavailable
      </span>
    );
  }

  return (
    <a
      className="action-button action-button--primary"
      href={resume.previewUrl || resume.url}
      target="_blank"
      rel="noreferrer"
    >
      <span>View resume</span>
      <ArrowUpRight size={18} />
    </a>
  );
}

export default memo(ResumeButton);
