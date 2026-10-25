import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Activity,
  PlayCircle,
  BarChart2,
  FileText,
  ShieldAlert,
  User,
  Settings,
  Cpu,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useBehaviourTracker } from "../hooks/useBehaviourTracker";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/monitoring", icon: Activity, label: "Live Monitoring" },
  { path: "/demo", icon: PlayCircle, label: "Demo Mode" },
  { path: "/analytics", icon: BarChart2, label: "Analytics" },
  { path: "/logs", icon: FileText, label: "Session Logs" },
  { path: "/alerts", icon: ShieldAlert, label: "Alerts" },
  { path: "/profile", icon: User, label: "Profile" },
  { path: "/ai", icon: Cpu, label: "AI Model" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get auth state and start tracking behaviour
  const { isAuthenticated } = useAuth();
  useBehaviourTracker(isAuthenticated);

  const SidebarContent = () => (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "0 12px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          S
        </div>
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: "700" }}>Sentinel</h1>
          <p
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Secure System
          </p>
        </div>
      </div>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          flex: 1,
        }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "12px 16px",
              borderRadius: "12px",
              color: isActive ? "white" : "var(--text-muted)",
              background: isActive ? "rgba(139, 92, 246, 0.15)" : "transparent",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: isActive ? "600" : "500",
              transition: "all 0.2s",
              border: isActive
                ? "1px solid rgba(139, 92, 246, 0.3)"
                : "1px solid transparent",
            })}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  );

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Desktop Sidebar */}
      <aside
        style={{
          width: "280px",
          padding: "32px 20px",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          display: "none",
          flexDirection: "column",
          background: "rgba(5, 5, 8, 0.4)",
          backdropFilter: "blur(20px)",
          zIndex: 50,
          "@media (min-width: 1024px)": { display: "flex" },
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
                zIndex: 99,
              }}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{
                position: "fixed",
                top: 0,
                bottom: 0,
                left: 0,
                width: "280px",
                background: "rgba(10, 10, 15, 0.95)",
                backdropFilter: "blur(30px)",
                padding: "32px 20px",
                display: "flex",
                flexDirection: "column",
                zIndex: 100,
                borderRight: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  position: "absolute",
                  top: "24px",
                  right: "24px",
                  background: "transparent",
                  border: "none",
                  color: "white",
                }}
              >
                <X size={24} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: "auto", position: "relative" }}>
        {/* Topbar */}
        <header
          style={{
            height: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            background: "rgba(5, 5, 8, 0.5)",
            backdropFilter: "blur(20px)",
            position: "sticky",
            top: 0,
            zIndex: 40,
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              display: "flex",
              "@media (min-width: 1024px)": { display: "none" },
            }}
          >
            <Menu size={24} />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginLeft: "auto",
            }}
          >
            <div
              style={{
                textAlign: "right",
                display: "none",
                "@media (min-width: 640px)": { display: "block" },
              }}
            >
              <p style={{ fontSize: "14px", fontWeight: "600" }}>John Doe</p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Admin
              </p>
            </div>
            <div
              className="liquid-glass"
              style={{
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                cursor: "pointer",
                borderRadius: "50%",
              }}
            >
              JD
            </div>
          </div>
        </header>

        <motion.div
          key={window.location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="page-container"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
