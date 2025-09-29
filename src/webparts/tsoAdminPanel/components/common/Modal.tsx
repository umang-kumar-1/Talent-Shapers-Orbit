import * as React from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  // Handle Escape key to close modal
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
        animation: "fadeIn 0.2s ease-out",
      }}
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "640px",
          animation: "scaleIn 0.2s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#1e293b",
              margin: 0,
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              color: "#94a3b8",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "9999px",
              padding: "4px",
              transition: "color 0.2s ease-in-out",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#475569")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
          >
            <svg
              style={{ width: "24px", height: "24px" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px" }}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
