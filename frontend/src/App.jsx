import { useState, useEffect } from "react";

export default function App() {
  const [message, setMessage] = useState("...");

  useEffect(() => {
    fetch("/api/hello")
      .then((r) => r.json())
      .then((d) => setMessage(d.message))
      .catch(() => setMessage("could not reach API"));
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f0f",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "monospace",
      color: "#fff",
      gap: "16px",
    }}>
      <div style={{ fontSize: "14px", color: "#555", letterSpacing: "0.2em" }}>
        FASTAPI + REACT
      </div>
      <div style={{ fontSize: "48px", fontWeight: "bold" }}>
        {message}
      </div>
      <div style={{ fontSize: "12px", color: "#333" }}>
        from /api/hello
      </div>
    </div>
  );
}