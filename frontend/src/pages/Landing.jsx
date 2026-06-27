import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Landing = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    { icon: "🏭", title: "Supplier Network", desc: "Onboard suppliers, track PO lifecycle and performance scores in real time." },
    { icon: "📦", title: "Smart Inventory", desc: "Live stock levels, auto low-stock alerts and inventory value calculations." },
    { icon: "🛒", title: "Order Fulfillment", desc: "End-to-end order workflow from cart to doorstep with role-gated approvals." },
    { icon: "📊", title: "Analytics", desc: "Revenue trends, supplier charts, inventory distribution — all in one view." },
    { icon: "🔍", title: "Chain Tracking", desc: "Trace any product's full journey: supplier → warehouse → retailer." },
    { icon: "🔐", title: "Role-Based Access", desc: "Admin, Supplier, Warehouse, Retailer — each sees only what they need." },
  ];

  const workflow = [
    { label: "Supplier", color: "#6366f1", desc: "Accepts PO & ships goods" },
    { label: "Warehouse", color: "#06b6d4", desc: "Receives & stores inventory" },
    { label: "Retailer", color: "#10b981", desc: "Places order from stock" },
    { label: "Delivered", color: "#f59e0b", desc: "Fulfilled with audit trail" },
  ];

  const roles = [
    { title: "Admin", emoji: "👑", color: "#6366f1", bg: "#6366f115", perms: ["Full system control", "User management", "Analytics & reports", "Override any status"] },
    { title: "Supplier", emoji: "🏭", color: "#06b6d4", bg: "#06b6d415", perms: ["Accept / reject POs", "Mark shipments", "Manage products", "Track performance"] },
    { title: "Warehouse", emoji: "🏗️", color: "#10b981", bg: "#10b98115", perms: ["Receive shipments", "Fulfill retailer orders", "Manage inventory", "Transaction history"] },
    { title: "Retailer", emoji: "🛍️", color: "#f59e0b", bg: "#f59e0b15", perms: ["Browse products", "Cart & checkout", "Track orders", "Reorder in one click"] },
  ];

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", backgroundColor: "#0a0a0f", color: "#fff", overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "0 5%",
        height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(10,10,15,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={logo} alt="SupplySync" style={{ height: 36, filter: "drop-shadow(0 0 8px rgba(99,102,241,0.5))" }} />
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={() => navigate("/login")} style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff", padding: "8px 20px", borderRadius: 8, cursor: "pointer",
            fontSize: 14, fontWeight: 500, transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.target.style.borderColor = "#6366f1"; e.target.style.color = "#a5b4fc"; }}
            onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; e.target.style.color = "#fff"; }}>
            Sign In
          </button>
          <button onClick={() => navigate("/register")} style={{
            background: "linear-gradient(135deg, #6366f1, #06b6d4)",
            border: "none", color: "#fff", padding: "8px 20px",
            borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600,
            boxShadow: "0 0 20px rgba(99,102,241,0.4)", transition: "all 0.2s",
          }}
            onMouseEnter={e => e.target.style.opacity = "0.85"}
            onMouseLeave={e => e.target.style.opacity = "1"}>
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "100px 5% 80px",
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(6,182,212,0.1) 0%, transparent 60%), #0a0a0f",
        textAlign: "center", position: "relative",
      }}>
        {/* Animated grid lines */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
          borderRadius: 100, padding: "6px 16px", marginBottom: 32,
          fontSize: 13, color: "#a5b4fc", fontWeight: 500,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block", animation: "pulse 2s infinite" }} />
          Enterprise Supply Chain Management
        </div>

        {/* Logo — with drop-shadow instead of white box */}
        <img src={logo} alt="SupplySync"
          style={{ height: 110, marginBottom: 28, filter: "drop-shadow(0 0 30px rgba(99,102,241,0.4)) drop-shadow(0 0 60px rgba(6,182,212,0.2))" }} />

        <h1 style={{
          fontSize: "clamp(2.4rem, 6vw, 4.5rem)", fontWeight: 800,
          lineHeight: 1.1, margin: "0 0 20px",
          background: "linear-gradient(135deg, #fff 40%, #a5b4fc 70%, #67e8f9 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Supply Chain,<br />Made Simple.
        </h1>

        <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "rgba(255,255,255,0.55)", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7 }}>
          One platform for suppliers, warehouses, and retailers — with real-time inventory tracking, smart order workflows, and a complete audit trail.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/register")} style={{
            background: "linear-gradient(135deg, #6366f1, #06b6d4)",
            border: "none", color: "#fff", padding: "14px 32px",
            borderRadius: 10, cursor: "pointer", fontSize: 16, fontWeight: 700,
            boxShadow: "0 0 30px rgba(99,102,241,0.5)", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 0 40px rgba(99,102,241,0.7)"; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 0 30px rgba(99,102,241,0.5)"; }}>
            Start for Free →
          </button>
          <button onClick={() => navigate("/login")} style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff", padding: "14px 32px", borderRadius: 10,
            cursor: "pointer", fontSize: 16, fontWeight: 600, transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.borderColor = "rgba(255,255,255,0.3)"; }}
            onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.borderColor = "rgba(255,255,255,0.15)"; }}>
            Sign In
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 48, marginTop: 72, flexWrap: "wrap", justifyContent: "center" }}>
          {[["4", "User Roles"], ["30+", "API Endpoints"], ["17", "Core Modules"], ["100%", "Role-Gated"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, background: "linear-gradient(135deg, #6366f1, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{val}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WORKFLOW STRIP */}
      <section style={{ padding: "60px 5%", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ textAlign: "center", fontSize: 12, letterSpacing: 3, color: "rgba(255,255,255,0.3)", marginBottom: 32, textTransform: "uppercase" }}>The SupplySync Lifecycle</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 0, maxWidth: 900, margin: "0 auto" }}>
          {workflow.map((w, i) => (
            <React.Fragment key={w.label}>
              <div style={{ textAlign: "center", padding: "0 16px" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%", margin: "0 auto 10px",
                  background: `${w.color}20`, border: `2px solid ${w.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, fontWeight: 800, color: w.color,
                }}>{i + 1}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>{w.label}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4, maxWidth: 110 }}>{w.desc}</div>
              </div>
              {i < workflow.length - 1 && (
                <div style={{ color: "rgba(255,255,255,0.15)", fontSize: 24, padding: "0 4px", marginBottom: 28 }}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "100px 5%" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p style={{ fontSize: 12, letterSpacing: 3, color: "#6366f1", textTransform: "uppercase", marginBottom: 12 }}>Platform Features</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, margin: 0 }}>Everything in one place</h2>
          <p style={{ color: "rgba(255,255,255,0.45)", marginTop: 12, fontSize: 16 }}>No spreadsheets. No email chains. Just a clean, connected system.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16, padding: 28, transition: "all 0.25s", cursor: "default",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.08)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{f.title}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ROLES */}
      <section style={{ padding: "100px 5%", background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(6,182,212,0.07) 0%, transparent 70%)" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p style={{ fontSize: 12, letterSpacing: 3, color: "#06b6d4", textTransform: "uppercase", marginBottom: 12 }}>Who It's For</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, margin: 0 }}>Built for every role</h2>
          <p style={{ color: "rgba(255,255,255,0.45)", marginTop: 12, fontSize: 16 }}>Each user gets exactly the access they need — nothing more, nothing less.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {roles.map((r) => (
            <div key={r.title} style={{
              background: r.bg, border: `1px solid ${r.color}30`,
              borderRadius: 16, padding: 28, transition: "all 0.25s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${r.color}20`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{r.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: 20, color: r.color, marginBottom: 12 }}>{r.title}</div>
              {r.perms.map(p => (
                <div key={p} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: r.color, fontSize: 14 }}>✓</span>
                  <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }}>{p}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "100px 5%", textAlign: "center",
        background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <img src={logo} alt="SupplySync" style={{ height: 72, marginBottom: 24, filter: "drop-shadow(0 0 20px rgba(99,102,241,0.5))" }} />
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, margin: "0 0 16px" }}>
          Ready to sync your supply chain?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 16, marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
          Retailers can register instantly. Suppliers and warehouse teams get access from your admin.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/register")} style={{
            background: "linear-gradient(135deg, #6366f1, #06b6d4)",
            border: "none", color: "#fff", padding: "14px 36px",
            borderRadius: 10, cursor: "pointer", fontSize: 16, fontWeight: 700,
            boxShadow: "0 0 30px rgba(99,102,241,0.5)", transition: "all 0.2s",
          }}
            onMouseEnter={e => e.target.style.opacity = "0.85"}
            onMouseLeave={e => e.target.style.opacity = "1"}>
            Register as Retailer
          </button>
          <button onClick={() => navigate("/login")} style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff", padding: "14px 36px", borderRadius: 10,
            cursor: "pointer", fontSize: 16, fontWeight: 600, transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.target.style.borderColor = "#6366f1"; e.target.style.color = "#a5b4fc"; }}
            onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; e.target.style.color = "#fff"; }}>
            Sign In
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: "24px 5%", borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={logo} alt="SupplySync" style={{ height: 28, filter: "drop-shadow(0 0 6px rgba(99,102,241,0.4))" }} />
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Supply Made Easy</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>© 2026 SupplySync</span>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; }
      `}</style>
    </div>
  );
};

export default Landing;
