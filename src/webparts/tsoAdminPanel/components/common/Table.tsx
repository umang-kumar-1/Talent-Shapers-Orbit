import * as React from "react";

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        overflowX: "auto",
      }}
    >
      <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
        <thead>
          <tr
            style={{
              borderBottom: "1px solid #e2e8f0", // slate-200
            }}
          >
            {headers.map((header, index) => (
              <th
                key={index}
                style={{
                  padding: "12px 16px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#64748b", // slate-500
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default Table;
