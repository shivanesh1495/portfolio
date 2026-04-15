import { useState, useEffect } from "react";
import {
  fetchGitHubCertifications,
  fetchGitHubExperience,
  fetchGitHubProjects,
  fetchGitHubResume,
  fetchGitHubWritings,
  fetchGitHubUserProfile,
} from "../services/github";

const CERTIFICATIONS_CACHE_KEY = "portfolio:certifications-cache";
const RESUME_CACHE_KEY = "portfolio:resume-cache";
let certificationsMemoryCache = null;
let certificationsMemoryPromise = null;
let resumeMemoryCache = null;
let resumeMemoryPromise = null;

function readCertificationsSessionCache() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(CERTIFICATIONS_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCertificationsSessionCache(value) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(
      CERTIFICATIONS_CACHE_KEY,
      JSON.stringify(value),
    );
  } catch {
    // Ignore storage quota and privacy mode errors.
  }
}

function readResumeSessionCache() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(RESUME_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeResumeSessionCache(value) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(RESUME_CACHE_KEY, JSON.stringify(value));
  } catch {
    // Ignore storage quota and privacy mode errors.
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    try {
      window.sessionStorage.removeItem(CERTIFICATIONS_CACHE_KEY);
      window.sessionStorage.removeItem(RESUME_CACHE_KEY);
    } catch {
      // Ignore unload cleanup failures.
    }
  });
}

export function useGitHubProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchGitHubProjects();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { projects, loading, error };
}

export function useGitHubProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchGitHubUserProfile();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { profile, loading, error };
}

export function useGitHubWritings() {
  const [writings, setWritings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchGitHubWritings();
        setWritings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { writings, loading, error };
}

export function useGitHubExperience() {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchGitHubExperience();
        setExperience(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { experience, loading, error };
}

export function useGitHubCertifications() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const sessionCache =
          certificationsMemoryCache || readCertificationsSessionCache();

        if (sessionCache) {
          certificationsMemoryCache = sessionCache;
          if (!cancelled) {
            setCertifications(sessionCache);
          }
          return;
        }

        if (!certificationsMemoryPromise) {
          certificationsMemoryPromise = fetchGitHubCertifications()
            .then((data) => {
              certificationsMemoryCache = data;
              writeCertificationsSessionCache(data);
              certificationsMemoryPromise = null;
              return data;
            })
            .catch((err) => {
              certificationsMemoryPromise = null;
              throw err;
            });
        }

        const data = await certificationsMemoryPromise;
        if (!cancelled) {
          setCertifications(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { certifications, loading, error };
}

export function useGitHubResume() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const sessionCache = resumeMemoryCache || readResumeSessionCache();

        if (sessionCache) {
          resumeMemoryCache = sessionCache;
          if (!cancelled) {
            setResume(sessionCache);
          }
          return;
        }

        if (!resumeMemoryPromise) {
          resumeMemoryPromise = fetchGitHubResume()
            .then((data) => {
              resumeMemoryCache = data;
              writeResumeSessionCache(data);
              resumeMemoryPromise = null;
              return data;
            })
            .catch((err) => {
              resumeMemoryPromise = null;
              throw err;
            });
        }

        const data = await resumeMemoryPromise;
        if (!cancelled) {
          setResume(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { resume, loading, error };
}
