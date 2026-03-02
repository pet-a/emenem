import { useState, useEffect, useCallback } from "react";

// All requests go to /api — in dev Vite proxies to localhost:8000,
// in production they hit the same FastAPI server that serves this file.
const API = "/api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, done: 0, pending: 0 });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      const [tasksRes, statsRes] = await Promise.all([
        fetch(`${API}/tasks`),
        fetch(`${API}/stats`),
      ]);
      if (!tasksRes.ok) throw new Error("Failed to load tasks");
      setTasks(await tasksRes.json());
      setStats(await statsRes.json());
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const addTask = async () => {
    const title = input.trim();
    if (!title) return;
    setInput("");
    try {
      const res = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error();
      const task = await res.json();
      setTasks((t) => [...t, task]);
      setStats((s) => ({ ...s, total: s.total + 1, pending: s.pending + 1 }));
    } catch {
      setError("Failed to add task");
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    // Optimistic update
    const newDone = !task.done;
    setTasks((ts) => ts.map((t) => t.id === id ? { ...t, done: newDone } : t));
    setStats((s) => ({
      ...s,
      done: s.done + (newDone ? 1 : -1),
      pending: s.pending + (newDone ? -1 : 1),
    }));
    try {
      await fetch(`${API}/tasks/${id}`, { method: "PATCH" });
    } catch {
      // Rollback on failure
      setTasks((ts) => ts.map((t) => t.id === id ? { ...t, done: task.done } : t));
      setStats((s) => ({
        ...s,
        done: s.done + (newDone ? -1 : 1),
        pending: s.pending + (newDone ? 1 : -1),
      }));
    }
  };

  const deleteTask = async (id) => {
    const task = tasks.find((t) => t.id === id);
    // Optimistic update
    setTasks((ts) => ts.filter((t) => t.id !== id));
    setStats((s) => ({
      ...s,
      total: s.total - 1,
      done: s.done - (task?.done ? 1 : 0),
      pending: s.pending - (!task?.done ? 1 : 0),
    }));
    try {
      await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
    } catch {
      setError("Failed to delete task");
      fetchAll(); // Re-sync on failure
    }
  };

  const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e8e6f0", fontFamily: "'DM Mono', 'Courier New', monospace", padding: "0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #5c4af0; color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #2a2a3f; border-radius: 2px; }
        .task-row { transition: all 0.2s ease; border-bottom: 1px solid #16161f; }
        .task-row:hover { background: #111118 !important; }
        .task-row:hover .delete-btn { opacity: 1 !important; }
        .delete-btn { opacity: 0; transition: opacity 0.2s; background: none; border: none; color: #3a3a5a; cursor: pointer; font-size: 18px; line-height: 1; padding: 2px 6px; flex-shrink: 0; }
        .delete-btn:hover { color: #f06060; }
        .add-btn { background: #5c4af0; border: none; border-radius: 8px; padding: 12px 20px; color: #fff; font-size: 13px; font-family: inherit; font-weight: 500; cursor: pointer; letter-spacing: 0.05em; transition: background 0.2s; }
        .add-btn:hover { background: #6d5cf7; }
        .add-btn:active { transform: scale(0.97); }
        .toggle-circle { transition: all 0.2s ease; cursor: pointer; width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .toggle-circle:hover { filter: brightness(1.3); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .task-animate { animation: fadeIn 0.25s ease forwards; }
        @keyframes barFill { from { width: 0; } to { width: var(--w); } }
        .bar-fill { animation: barFill 1s ease forwards; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 20px; height: 20px; border: 2px solid #1a1a2e; border-top-color: #5c4af0; border-radius: 50%; animation: spin 0.7s linear infinite; margin: 48px auto; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a1a2e", padding: "28px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px", color: "#fff" }}>TASKR</div>
          <div style={{ fontSize: "11px", color: "#4a4a6a", marginTop: "2px", letterSpacing: "0.05em" }}>FASTAPI + REACT + POSTGRES</div>
        </div>
        <div style={{
          fontSize: "10px", padding: "5px 12px", borderRadius: "20px", letterSpacing: "0.08em",
          border: `1px solid ${error ? "#3a1a1a" : "#1a3a1a"}`,
          background: error ? "#1f0d0d" : "#0d1f0d",
          color: error ? "#f06060" : "#4caf50",
        }}>
          {error ? "● ERROR" : "● LIVE"}
        </div>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Error banner */}
        {error && (
          <div style={{ background: "#1f0d0d", border: "1px solid #3a1a1a", borderRadius: "8px", padding: "12px 16px", marginBottom: "24px", fontSize: "12px", color: "#f06060" }}>
            {error}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "36px" }}>
          {[
            { label: "TOTAL",   value: stats.total,   color: "#e8e6f0" },
            { label: "DONE",    value: stats.done,    color: "#4caf50" },
            { label: "PENDING", value: stats.pending, color: "#f0b429" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#0f0f1a", border: "1px solid #1a1a2e", borderRadius: "8px", padding: "16px 20px" }}>
              <div style={{ fontSize: "10px", color: "#4a4a6a", letterSpacing: "0.1em", marginBottom: "6px" }}>{s.label}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#4a4a6a", marginBottom: "8px", letterSpacing: "0.06em" }}>
            <span>PROGRESS</span><span>{pct}%</span>
          </div>
          <div style={{ height: "3px", background: "#1a1a2e", borderRadius: "2px", overflow: "hidden" }}>
            <div className="bar-fill" style={{ "--w": `${pct}%`, height: "100%", background: "linear-gradient(90deg, #5c4af0, #9c84ff)", borderRadius: "2px" }} />
          </div>
        </div>

        {/* Add Task */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="new task..."
            style={{
              flex: 1, background: "#0f0f1a", border: "1px solid #1a1a2e", borderRadius: "8px",
              padding: "12px 16px", color: "#e8e6f0", fontSize: "13px", fontFamily: "inherit",
              outline: "none", transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#5c4af0")}
            onBlur={(e) => (e.target.style.borderColor = "#1a1a2e")}
          />
          <button className="add-btn" onClick={addTask}>+ ADD</button>
        </div>

        {/* Tasks */}
        <div style={{ background: "#0f0f1a", border: "1px solid #1a1a2e", borderRadius: "10px", overflow: "hidden" }}>
          {loading ? (
            <div className="spinner" />
          ) : tasks.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center", color: "#2a2a4a", fontSize: "13px" }}>
              no tasks yet — add one above
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="task-row task-animate"
                style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 20px", background: "transparent" }}>
                <div
                  className="toggle-circle"
                  onClick={() => toggleTask(task.id)}
                  style={{
                    border: `2px solid ${task.done ? "#5c4af0" : "#2a2a4a"}`,
                    background: task.done ? "#5c4af0" : "transparent",
                  }}
                >
                  {task.done && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1, fontSize: "13px", color: task.done ? "#3a3a5a" : "#c8c6e0", textDecoration: task.done ? "line-through" : "none" }}>
                  {task.title}
                </div>
                <div style={{ fontSize: "10px", color: "#2a2a4a", letterSpacing: "0.05em", flexShrink: 0 }}>
                  {new Date(task.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
                <button className="delete-btn" onClick={() => deleteTask(task.id)}>×</button>
              </div>
            ))
          )}
        </div>

        {/* API Endpoints */}
        <div style={{ marginTop: "36px", background: "#0a0a0f", border: "1px solid #1a1a2e", borderRadius: "10px", padding: "20px" }}>
          <div style={{ fontSize: "10px", color: "#4a4a6a", letterSpacing: "0.1em", marginBottom: "14px" }}>API ENDPOINTS</div>
          {[
            { method: "GET",    path: "/api/tasks",      desc: "list all tasks" },
            { method: "POST",   path: "/api/tasks",      desc: "create a task" },
            { method: "PATCH",  path: "/api/tasks/:id",  desc: "toggle done" },
            { method: "DELETE", path: "/api/tasks/:id",  desc: "remove task" },
            { method: "GET",    path: "/api/stats",      desc: "task statistics" },
            { method: "GET",    path: "/api/health",     desc: "health check" },
          ].map((ep) => (
            <div key={ep.method + ep.path} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "5px 0", borderBottom: "1px solid #0f0f1a" }}>
              <span style={{
                fontSize: "10px", fontWeight: 500, letterSpacing: "0.06em", minWidth: "55px",
                color: ep.method === "GET" ? "#4caf50" : ep.method === "POST" ? "#5c9af0" : ep.method === "DELETE" ? "#f06060" : "#f0b429",
              }}>{ep.method}</span>
              <span style={{ fontSize: "12px", color: "#8888aa", minWidth: "160px" }}>{ep.path}</span>
              <span style={{ fontSize: "11px", color: "#3a3a5a" }}>{ep.desc}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
