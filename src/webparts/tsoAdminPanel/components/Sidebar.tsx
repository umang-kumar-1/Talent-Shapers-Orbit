import * as React from "react";
import type { ViewType } from "./App";

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const NavItem: React.FC<{
  viewName: ViewType;
  label: string;
  icon: React.ReactElement;
  activeView: ViewType;
  onClick: (view: ViewType) => void;
}> = ({ viewName, label, icon, activeView, onClick }) => {
  const isActive = activeView === viewName;

  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px",
        margin: "4px 0",
        borderRadius: "8px",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.2s ease-in-out",
        backgroundColor: isActive ? "#EEF2FF" : "transparent",
        color: isActive ? "#4F46E5" : "#64748B",
        fontWeight: 500,
      }}
      onClick={() => onClick(viewName)}
    >
      {isActive && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "4px",
            backgroundColor: "#6366F1",
            borderTopRightRadius: "9999px",
            borderBottomRightRadius: "9999px",
          }}
        />
      )}
      {React.cloneElement(icon, {
        style: { width: "24px", height: "24px", marginRight: "12px" },
      })}
      <span>{label}</span>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  theme,
  toggleTheme,
}) => {
  const navItems = [
    { view: "dashboard", label: "Dashboard", icon: <HomeIcon /> },
    { view: "students", label: "Students", icon: <UsersIcon /> },
    { view: "trainers", label: "Trainers", icon: <BriefcaseIcon /> },
    { view: "courses", label: "Courses", icon: <BookOpenIcon /> },
    { view: "fees", label: "Fee Collection", icon: <CurrencyDollarIcon /> },
    { view: "expenses", label: "Expenses", icon: <ChartPieIcon /> },
    { view: "assignments", label: "Assignments", icon: <ClipboardListIcon /> },
  ];

  return (
    <aside
      style={{
        width: "256px",
        backgroundColor: theme === "light" ? "#ffffff" : "#1E293B",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>
        <div
          style={{
            padding: "16px",
            borderBottom: `1px solid ${
              theme === "light" ? "#E2E8F0" : "#334155"
            }`,
          }}
        >
          <h1
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              textAlign: "center",
              color: theme === "light" ? "#1E293B" : "#ffffff",
            }}
          >
            Talent Shapers{" "}
            <span
              style={{
                color: theme === "light" ? "#4F46E5" : "#818CF8",
              }}
            >
              Orbit
            </span>
          </h1>
        </div>
        <nav style={{ padding: "16px" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {navItems.map((item) => (
              <NavItem
                key={item.view}
                viewName={item.view as ViewType}
                label={item.label}
                icon={item.icon}
                activeView={activeView}
                onClick={setActiveView}
              />
            ))}
          </ul>
        </nav>
      </div>
      <div
        style={{
          marginTop: "auto",
          padding: "16px",
          borderTop: `1px solid ${
            theme === "light" ? "#E2E8F0" : "#334155"
          }`,
        }}
      >
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${
            theme === "light" ? "dark" : "light"
          } mode`}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "transparent",
            color: theme === "light" ? "#64748B" : "#94A3B8",
            cursor: "pointer",
            transition: "background-color 0.2s ease-in-out",
          }}
        >
          {theme === "light" ? (
            <MoonIcon style={{ width: "24px", height: "24px" }} />
          ) : (
            <SunIcon style={{ width: "24px", height: "24px" }} />
          )}
          <span style={{ marginLeft: "8px", fontWeight: 600 }}>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </span>
        </button>
      </div>
    </aside>
  );
};

// SVG Icons (unchanged, only className replaced by inline if needed)
const HomeIcon: React.FC<{ style?: React.CSSProperties }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const UsersIcon: React.FC<{ style?: React.CSSProperties }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const BriefcaseIcon: React.FC<{ style?: React.CSSProperties }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const BookOpenIcon: React.FC<{ style?: React.CSSProperties }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
const CurrencyDollarIcon: React.FC<{ style?: React.CSSProperties }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 12v-2m0 2v.01m0 4v-2m0 2v.01M6 12h.01M18 12h.01M6 12a6 6 0 1112 0 6 6 0 01-12 0z" />
  </svg>
);
const ChartPieIcon: React.FC<{ style?: React.CSSProperties }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);
const ClipboardListIcon: React.FC<{ style?: React.CSSProperties }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);
const MoonIcon: React.FC<{ style?: React.CSSProperties }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);
const SunIcon: React.FC<{ style?: React.CSSProperties }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export default Sidebar;
