import * as React from "react";

interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
}) => {
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

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
        animation: "fadeIn 0.3s ease-in",
      }}
      aria-modal="true"
      role="dialog"
      onClick={onCancel}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95) translateY(10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
      `}</style>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "480px",
          animation: "scaleIn 0.2s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Content */}
        <div style={{ padding: "24px", textAlign: "center" }}>
          <div
            style={{
              margin: "0 auto 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "48px",
              width: "48px",
              borderRadius: "9999px",
              backgroundColor: "#fee2e2",
            }}
          >
            <svg
              style={{ height: "24px", width: "24px", color: "#dc2626" }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 
                1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 
                0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#111827",
              margin: "0 0 8px",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              fontSize: "14px",
              color: "#64748b",
              margin: 0,
            }}
          >
            {message}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            padding: "12px 16px",
            display: "flex",
            flexDirection: "row-reverse",
            borderTopLeftRadius: "0px",
            borderTopRightRadius: "0px",
            borderBottomLeftRadius: "12px",
            borderBottomRightRadius: "12px",
          }}
        >
          <button
            type="button"
            onClick={onConfirm}
            style={{
              backgroundColor: "#dc2626",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 500,
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              marginLeft: "12px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            {confirmButtonText}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              backgroundColor: "#ffffff",
              color: "#334155",
              fontSize: "14px",
              fontWeight: 500,
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            {cancelButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
