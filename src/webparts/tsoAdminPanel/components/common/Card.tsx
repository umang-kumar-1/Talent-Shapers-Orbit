import * as React from "react";

interface CardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  colors: {
    bg: string;   // Expecting something like "#f0f0f0"
    icon: string; // Expecting something like "#000000"
  };
}

const Card: React.FC<CardProps> = ({ title, value, icon, colors }) => {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <p
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "#64748b", // slate-500
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            margin: 0,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "#1e293b", // slate-800
            margin: 0,
          }}
        >
          {value}
        </p>
      </div>
      <div
        style={{
          padding: "12px",
          borderRadius: "9999px",
          backgroundColor: colors.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {React.cloneElement(icon, {
          style: {
            width: "28px",
            height: "28px",
            color: colors.icon,
          },
        })}
      </div>
    </div>
  );
};

export default Card;
