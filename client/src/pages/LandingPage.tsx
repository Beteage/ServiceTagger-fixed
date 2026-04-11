import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import scheduleScreenshot from "../assets/screenshot_schedule.png";
import customersScreenshot from "../assets/screenshot_customers.png";

import {
  CheckCircle2,
  Menu,
  X,
  Clock,
  Users,
  Search,
  ChevronRight,
  Brain,
  Tag,
} from "lucide-react";

const slides = [
  {
    label: "PLATFORM LAUNCH",
    headline: "ServiceTagger launches next-gen HVAC field management",
    cta: "Get early access",
    ctaHref: "mailto:founder@servicetagger.com?subject=Early Access Request",
  },
  {
    label: "AI FEATURES",
    headline: "ServiceTagger Brain now remembers your entire job history",
    cta: "Explore Brain",
    ctaHref: "#features",
  },
  {
    label: "SCHEDULING",
    headline: "Drag-and-drop dispatch is now live for all accounts",
    cta: "See how it works",
    ctaHref: "#how-it-works",
  },
  {
    label: "EARLY ACCESS",
    headline: "Join the HVAC shops shaping the future of field management",
    cta: "Apply now",
    ctaHref: "mailto:founder@servicetagger.com?subject=Early Access Request",
  },
];

const tickerItems = [
  "ServiceTagger launches private alpha for HVAC contractors",
  "AI Brain answers questions from your job history",
  "New drag-and-drop scheduling now live",
  "Customer management dashboard released",
];

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const current = slides[activeSlide];

  return (
    <div
      className="min-h-screen bg-white text-slate-900"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* ─── NAVBAR ─── */}
      <nav
        className="fixed w-full z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(0,0,0,0.1)"
            : "1px solid transparent",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 clamp(1rem, 4vw, 2rem)",
          }}
        >
          <div
            className="flex items-center justify-between"
            style={{ height: "68px" }}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <img
                src={logo}
                alt="ServiceTagger"
                style={{ height: "24px", width: "auto" }}
              />
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  color: scrolled ? "#0f172a" : "#ffffff",
                  letterSpacing: "-0.01em",
                }}
              >
                Service
                <span style={{ color: scrolled ? "#2563eb" : "#93c5fd" }}>
                  Tagger
                </span>
              </span>
            </Link>

            {/* Center nav */}
            <div
              className="hidden md:flex items-center"
              style={{ gap: "2.2rem" }}
            >
              {[
                "Features",
                "How It Works",
                "AI Brain",
                "Scheduling",
                "Pricing",
                "Contact",
              ].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: scrolled ? "#475569" : "rgba(255,255,255,0.85)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    letterSpacing: "0.01em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = scrolled
                      ? "#0f172a"
                      : "#ffffff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = scrolled
                      ? "#475569"
                      : "rgba(255,255,255,0.85)")
                  }
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Right side */}
            <div
              className="hidden md:flex items-center"
              style={{ gap: "1.5rem" }}
            >
              <Link
                to="/login"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: scrolled ? "#475569" : "rgba(255,255,255,0.85)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = scrolled
                    ? "#0f172a"
                    : "#ffffff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = scrolled
                    ? "#475569"
                    : "rgba(255,255,255,0.85)")
                }
              >
                Sign In
              </Link>
              <button
                aria-label="Search"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: scrolled ? "#475569" : "rgba(255,255,255,0.85)",
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                }}
              >
                <Search style={{ width: "20px", height: "20px" }} />
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: scrolled ? "#0f172a" : "#ffffff",
              }}
            >
              {mobileMenuOpen ? (
                <X style={{ width: "24px", height: "24px" }} />
              ) : (
                <Menu style={{ width: "24px", height: "24px" }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            style={{
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(12px)",
              padding: "1rem 2rem 1.5rem",
              borderTop: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            {[
              "Features",
              "How It Works",
              "AI Brain",
              "Scheduling",
              "Contact",
            ].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "block",
                  color: "#334155",
                  textDecoration: "none",
                  padding: "0.6rem 0",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                }}
              >
                {item}
              </a>
            ))}
            <Link
              to="/login"
              style={{
                display: "block",
                color: "#334155",
                textDecoration: "none",
                padding: "0.6rem 0",
                fontSize: "0.95rem",
                fontWeight: 500,
              }}
            >
              Sign In
            </Link>
            <a
              href="mailto:founder@servicetagger.com?subject=Early Access Request"
              style={{
                display: "block",
                marginTop: "0.75rem",
                background: "#2563eb",
                color: "#ffffff",
                textAlign: "center",
                padding: "0.75rem 1rem",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "0.95rem",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Early Access
            </a>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <header
        style={{
          position: "relative",
          height: "100vh",
          minHeight: "620px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/hvac-hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Dark gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.72) 100%)",
          }}
        />

        {/* Hero content — bottom left like ExxonMobil */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            paddingBottom: "5rem",
            paddingLeft: "clamp(1rem, 4vw, 7rem)",
            paddingRight: "clamp(1rem, 4vw, 7rem)",
            maxWidth: "750px",
            minWidth: "0",
          }}
        >
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.65)",
              textTransform: "uppercase",
              marginBottom: "0.85rem",
              margin: "0 0 0.85rem 0",
            }}
          >
            {current.label}
          </p>
          <h1
            style={{
              fontSize: "clamp(1.5rem, 5vw, 3.6rem)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.1,
              margin: "0 0 2rem 0",
              letterSpacing: "-0.02em",
            }}
          >
            {current.headline}
          </h1>
          <a
            href={current.ctaHref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              background: "#2563eb",
              color: "#ffffff",
              padding: "0.85rem 1.75rem",
              fontWeight: 700,
              fontSize: "0.95rem",
              textDecoration: "none",
              transition: "background 0.2s",
              width: "100%",
              justifyContent: "center",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
          >
            {current.cta}
            <ChevronRight style={{ width: "16px", height: "16px" }} />
          </a>
        </div>

        {/* ─── Bottom ticker strip ─── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            background: "rgba(0,0,0,0.62)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              }}
            >
              {tickerItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveSlide(i);
                    setIsPlaying(false);
                  }}
                  style={{
                    position: "relative",
                    padding:
                      "clamp(0.8rem, 2vw, 1.1rem) clamp(1rem, 3vw, 1.5rem)",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    borderRight:
                      i < tickerItems.length - 1
                        ? "1px solid rgba(255,255,255,0.12)"
                        : "none",
                    cursor: "pointer",
                  }}
                >
                  {/* Active indicator bar at top */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "3px",
                      background: i === activeSlide ? "#2563eb" : "transparent",
                      transition: "background 0.3s",
                    }}
                  />
                  {/* Progress bar for active */}
                  {i === activeSlide && isPlaying && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        height: "3px",
                        background: "#60a5fa",
                        animation: "progress 5.5s linear",
                      }}
                    />
                  )}
                  <span
                    style={{
                      fontSize: "clamp(0.72rem, 1.1vw, 0.82rem)",
                      lineHeight: 1.4,
                      color:
                        i === activeSlide
                          ? "#ffffff"
                          : "rgba(255,255,255,0.48)",
                      fontWeight: i === activeSlide ? 500 : 400,
                      transition: "color 0.2s",
                      display: "block",
                    }}
                  >
                    {item}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* keyframe for progress bar */}
        <style>{`
          @keyframes progress {
            from { width: 0%; }
            to   { width: 100%; }
          }
        `}</style>
      </header>

      {/* ─── ALPHA NOTICE ─── */}
      <section
        style={{
          padding: "1rem 0",
          background: "#1e293b",
          borderBottom: "1px solid #334155",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 2rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "#94a3b8",
              margin: 0,
            }}
          >
            Currently partnering with a small group of HVAC contractors in
            private alpha &mdash; limited spots available.
          </p>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section
        id="features"
        style={{ padding: "6rem 0", background: "#ffffff" }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 clamp(1.5rem, 5vw, 5rem)",
          }}
        >
          {/* Section header */}
          <div style={{ maxWidth: "640px", marginBottom: "4.5rem" }}>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "#2563eb",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              What We Do
            </p>
            <h2
              style={{
                fontSize: "clamp(2rem, 3.5vw, 2.9rem)",
                fontWeight: 700,
                color: "#0f172a",
                lineHeight: 1.1,
                margin: "0 0 1.25rem 0",
                letterSpacing: "-0.02em",
              }}
            >
              Everything to run HVAC jobs. Nothing you won't use.
            </h2>
            <p
              style={{
                fontSize: "1.05rem",
                color: "#475569",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Scheduling, customers, invoicing, and AI-powered job history.
              That's it.
            </p>
          </div>

          {/* Feature 1 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              gap: "2rem",
              alignItems: "center",
              marginBottom: "4rem",
            }}
          >
            <div style={{ flex: "1 1 340px", order: 2 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Clock
                    style={{ width: "20px", height: "20px", color: "#2563eb" }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    color: "#2563eb",
                    textTransform: "uppercase",
                  }}
                >
                  Scheduling & Dispatch
                </span>
              </div>
              <h3
                style={{
                  fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0 0 1rem 0",
                  letterSpacing: "-0.015em",
                }}
              >
                See where every tech is. Move jobs in seconds.
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#64748b",
                  lineHeight: 1.7,
                  marginBottom: "1.5rem",
                }}
              >
                Drag a job to reassign it. Your tech gets a push notification
                with the address and job details. You get confirmation from the
                office.
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                }}
              >
                {[
                  "Drag-and-drop weekly calendar",
                  "Push notifications to techs",
                  "Color-coded job status",
                  "Filter by tech, date, or job type",
                ].map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      fontSize: "0.9rem",
                      color: "#334155",
                      fontWeight: 500,
                    }}
                  >
                    <CheckCircle2
                      style={{
                        width: "16px",
                        height: "16px",
                        color: "#16a34a",
                        flexShrink: 0,
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ flex: "1 1 400px", order: 1 }}>
              <div
                style={{
                  background: "#f1f5f9",
                  padding: "clamp(0.5rem, 2vw, 1rem)",
                  border: "1px solid #e2e8f0",
                  width: "100%",
                }}
              >
                <img
                  src={scheduleScreenshot}
                  alt="Scheduling view"
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    height: "auto",
                    display: "block",
                    border: "1px solid #e2e8f0",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              gap: "2rem",
              alignItems: "center",
            }}
          >
            <div style={{ flex: "1 1 400px" }}>
              <div
                style={{
                  background: "#f1f5f9",
                  padding: "clamp(0.5rem, 2vw, 1rem)",
                  border: "1px solid #e2e8f0",
                  width: "100%",
                }}
              >
                <img
                  src={customersScreenshot}
                  alt="Customer management"
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    height: "auto",
                    display: "block",
                    border: "1px solid #e2e8f0",
                  }}
                />
              </div>
            </div>
            <div style={{ flex: "1 1 340px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Users
                    style={{ width: "20px", height: "20px", color: "#2563eb" }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    color: "#2563eb",
                    textTransform: "uppercase",
                  }}
                >
                  Customer Management
                </span>
              </div>
              <h3
                style={{
                  fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0 0 1rem 0",
                  letterSpacing: "-0.015em",
                }}
              >
                Every unit, every visit, every note — all in one place.
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#64748b",
                  lineHeight: 1.7,
                  marginBottom: "1.5rem",
                }}
              >
                Pull up any address and see every unit you've touched, every
                part installed, every note your techs left behind.
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                }}
              >
                {[
                  "Full service history per address",
                  "Equipment and model tracking",
                  "Notes from every tech visit",
                  "One-click call or text",
                ].map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      fontSize: "0.9rem",
                      color: "#334155",
                      fontWeight: 500,
                    }}
                  >
                    <CheckCircle2
                      style={{
                        width: "16px",
                        height: "16px",
                        color: "#16a34a",
                        flexShrink: 0,
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DIVIDER ─── */}
      <div
        style={{
          height: "4px",
          background: "linear-gradient(to right, #2563eb, #60a5fa, #2563eb)",
        }}
      />

      {/* ─── AI BRAIN SECTION ─── */}
      <section
        id="ai-brain"
        style={{ padding: "6rem 0", background: "#0f172a" }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 clamp(1.5rem, 5vw, 5rem)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            <div style={{ flex: "1 1 340px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#1e293b",
                  border: "1px solid #334155",
                  padding: "0.3rem 0.75rem",
                  marginBottom: "1.5rem",
                }}
              >
                <Brain
                  style={{ width: "12px", height: "12px", color: "#60a5fa" }}
                />
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: "#60a5fa",
                    textTransform: "uppercase",
                  }}
                >
                  Built-in AI Assistant
                </span>
              </div>
              <h2
                style={{
                  fontSize: "clamp(1.9rem, 3vw, 2.8rem)",
                  fontWeight: 700,
                  color: "#ffffff",
                  margin: "0 0 1.1rem 0",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                Ask Brain. It remembers your jobs.
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#94a3b8",
                  lineHeight: 1.7,
                  marginBottom: "1.75rem",
                }}
              >
                Ask where the Smith job parts are. Ask what compressor you
                installed at 412 Oak last March. Brain pulls from your actual
                job history — not the internet.
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 2rem 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                }}
              >
                {[
                  "Searches your past jobs and customer records",
                  "Answers questions about parts, addresses, and equipment",
                  "Learns from every job you log",
                  "No setup, no training — just start asking",
                ].map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      fontSize: "0.9rem",
                      color: "#cbd5e1",
                      fontWeight: 500,
                    }}
                  >
                    <CheckCircle2
                      style={{
                        width: "16px",
                        height: "16px",
                        color: "#60a5fa",
                        flexShrink: 0,
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <div
                style={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  padding: "1.25rem 1.5rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#94a3b8",
                    margin: "0 0 0.5rem 0",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Example
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#64748b",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  "Hey Brain, what compressor did we install at the Garza
                  address?"
                  <br />
                  <span style={{ color: "#60a5fa" }}>
                    Carrier 2-ton unit, installed March 2024. Serial: XC78-229A.
                  </span>
                </p>
              </div>
            </div>
            <div style={{ flex: "1 1 400px" }}>
              <div
                style={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  overflow: "hidden",
                }}
              >
                <img
                  src="/brain-screenshot.png"
                  alt="ServiceTagger Brain in action"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section
        id="how-it-works"
        style={{ padding: "6rem 0", background: "#f8fafc" }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 clamp(1.5rem, 5vw, 5rem)",
          }}
        >
          <div style={{ marginBottom: "4rem" }}>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "#2563eb",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              How It Works
            </p>
            <h2
              style={{
                fontSize: "clamp(2rem, 3.5vw, 2.9rem)",
                fontWeight: 700,
                color: "#0f172a",
                margin: "0 0 1rem 0",
                letterSpacing: "-0.02em",
              }}
            >
              From phone call to payment in three steps.
            </h2>
            <p style={{ fontSize: "1.05rem", color: "#475569", margin: 0 }}>
              No training. No onboarding calls. You'll know how it works in an
              afternoon.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "1.5px",
              background: "#e2e8f0",
            }}
          >
            {[
              {
                step: "01",
                title: "Create & Assign",
                desc: "Customer calls, you create a job in seconds. Drag it onto a tech's calendar. They get a push notification with the address and all job details.",
              },
              {
                step: "02",
                title: "Dispatch & Track",
                desc: "Your tech sees the job on their phone, drives to the site, logs parts used and time spent. You see their progress from the office in real time.",
              },
              {
                step: "03",
                title: "Invoice & Close",
                desc: "Job done. Send a Stripe invoice from the app in one tap. Customer pays online. You move to the next call with a full record of the visit.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "#ffffff",
                  padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 4vw, 2rem)",
                }}
              >
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    color: "#e2e8f0",
                    marginBottom: "1.25rem",
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {item.step}
                </div>
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: "0 0 0.75rem 0",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.93rem",
                    color: "#64748b",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section style={{ padding: "3.5rem 0", background: "#2563eb" }}>
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 clamp(1.5rem, 5vw, 5rem)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2rem",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            {[
              { stat: "< 1 hr", label: "Setup time from signup to first job" },
              { stat: "100%", label: "Web & mobile — no app store required" },
              {
                stat: "Free",
                label: "During the alpha — no credit card needed",
              },
              {
                stat: "Direct",
                label: "Access to the founder, not a support queue",
              },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: "center", minWidth: "160px" }}>
                <div
                  style={{
                    fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                    fontWeight: 800,
                    color: "#ffffff",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {item.stat}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.72)",
                    marginTop: "0.4rem",
                    fontWeight: 400,
                    lineHeight: 1.4,
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section
        style={{
          padding: "7rem 0",
          background: "#0f172a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle background texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage: "url('/hvac-tech-2.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "800px",
            margin: "0 auto",
            padding: "0 2rem",
            textAlign: "center",
          }}
        >
          <Tag
            style={{
              width: "40px",
              height: "40px",
              color: "#60a5fa",
              marginBottom: "1.5rem",
            }}
          />
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 700,
              color: "#ffffff",
              margin: "0 0 1.25rem 0",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Stop losing warranty paperwork.
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#94a3b8",
              margin: "0 0 2.5rem 0",
              lineHeight: 1.7,
              maxWidth: "520px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            We're looking for HVAC shops to join the alpha. Email the founder
            directly — no sales team, no demo calls.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <a
              href="mailto:founder@servicetagger.com?subject=Early Access Request&body=I'm interested in joining the ServiceTagger alpha."
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#2563eb",
                color: "#ffffff",
                padding: "0.95rem 2rem",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
                transition: "background 0.2s",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#1d4ed8")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#2563eb")
              }
            >
              Email Founder for Access{" "}
              <ChevronRight style={{ width: "16px", height: "16px" }} />
            </a>
            <Link
              to="/register"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "transparent",
                color: "#ffffff",
                padding: "0.95rem 2rem",
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: "none",
                border: "1.5px solid rgba(255,255,255,0.25)",
                transition: "border-color 0.2s",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)")
              }
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        style={{
          background: "#ffffff",
          padding: "3rem 0 2rem",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 clamp(1.5rem, 5vw, 5rem)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "clamp(1.5rem, 4vw, 3rem)",
              marginBottom: "clamp(1.5rem, 4vw, 3rem)",
            }}
          >
            {/* Brand */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  marginBottom: "1rem",
                }}
              >
                <img
                  src={logo}
                  alt="ServiceTagger"
                  style={{ height: "24px", width: "auto" }}
                />
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#0f172a",
                  }}
                >
                  Service<span style={{ color: "#2563eb" }}>Tagger</span>
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#64748b",
                  lineHeight: 1.65,
                  maxWidth: "220px",
                  margin: 0,
                }}
              >
                Job tracking and dispatch for HVAC contractors. Built with real
                crews.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  margin: "0 0 1.25rem 0",
                }}
              >
                Product
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                }}
              >
                {[
                  { label: "Features", href: "#features" },
                  { label: "How It Works", href: "#how-it-works" },
                  { label: "AI Brain", href: "#ai-brain" },
                  { label: "Login", href: "/login", isLink: true },
                ].map((item, i) =>
                  item.isLink ? (
                    <li key={i}>
                      <Link
                        to={item.href}
                        style={{
                          fontSize: "0.875rem",
                          color: "#64748b",
                          textDecoration: "none",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#2563eb")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#64748b")
                        }
                      >
                        {item.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={i}>
                      <a
                        href={item.href}
                        style={{
                          fontSize: "0.875rem",
                          color: "#64748b",
                          textDecoration: "none",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#2563eb")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#64748b")
                        }
                      >
                        {item.label}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  margin: "0 0 1.25rem 0",
                }}
              >
                Contact
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                }}
              >
                <li>
                  <a
                    href="mailto:founder@servicetagger.com"
                    style={{
                      fontSize: "0.875rem",
                      color: "#64748b",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#2563eb")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#64748b")
                    }
                  >
                    founder@servicetagger.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              borderTop: "1px solid #e2e8f0",
              paddingTop: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>
              &copy; {new Date().getFullYear()} ServiceTagger. All rights
              reserved.
            </p>
            <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>
              Built for the trades.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
