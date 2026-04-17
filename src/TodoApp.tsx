import { useState, useEffect } from "react";

// ============================================================
// 1. TYPESCRIPT INTERFACES — define your data shapes first!
// ============================================================

type FilterType = "all" | "active" | "completed";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// ============================================================
// 2. CHILD COMPONENT — TodoItem
//    Notice: typed props interface
// ============================================================

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 16px",
        borderBottom: "1px solid #f0ece4",
        transition: "background 0.15s",
        background: todo.completed ? "#fdf9f3" : "white",
      }}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          border: todo.completed ? "none" : "2px solid #c8bfad",
          background: todo.completed ? "#c07a3a" : "transparent",
          cursor: "pointer",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
          padding: 0,
        }}
        aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
      >
        {todo.completed && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Text */}
      <span
        style={{
          flex: 1,
          fontFamily: "'Lora', Georgia, serif",
          fontSize: "15px",
          color: todo.completed ? "#b0a898" : "#3d3530",
          textDecoration: todo.completed ? "line-through" : "none",
          transition: "all 0.2s",
        }}
      >
        {todo.text}
      </span>

      {/* Delete */}
      <button
        onClick={() => onDelete(todo.id)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#c8bfad",
          fontSize: "18px",
          lineHeight: 1,
          padding: "2px 4px",
          borderRadius: "4px",
          transition: "color 0.15s",
        }}
        aria-label="Delete todo"
        onMouseEnter={e => (e.currentTarget.style.color = "#b85c38")}
        onMouseLeave={e => (e.currentTarget.style.color = "#c8bfad")}
      >
        ×
      </button>
    </div>
  );
}

// ============================================================
// 3. FILTER BUTTON component
// ============================================================

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterButton({ label, active, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "#c07a3a" : "transparent",
        color: active ? "white" : "#9a8e82",
        border: "none",
        borderRadius: "20px",
        padding: "5px 14px",
        fontSize: "12px",
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 0.2s",
        fontWeight: active ? 600 : 400,
      }}
    >
      {label}
    </button>
  );
}

// ============================================================
// 4. MAIN APP COMPONENT
//    Concepts covered: useState, useEffect, derived state,
//    event handlers, array methods, conditional rendering
// ============================================================

export default function TodoApp() {
  // --- State ---
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Learn React component basics", completed: true, createdAt: new Date() },
    { id: 2, text: "Understand TypeScript interfaces", completed: false, createdAt: new Date() },
    { id: 3, text: "Build something fun this weekend", completed: false, createdAt: new Date() },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [nextId, setNextId] = useState<number>(4);

  // --- Derived state (no useState needed — computed from todos) ---
  const activeCount = todos.filter(t => !t.completed).length;

  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  // --- useEffect example: update document title ---
  useEffect(() => {
    document.title = activeCount > 0 ? `(${activeCount}) My Todos` : "My Todos";
  }, [activeCount]);

  // --- Event handlers ---
  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const newTodo: Todo = {
      id: nextId,
      text: trimmed,
      completed: false,
      createdAt: new Date(),
    };

    setTodos(prev => [...prev, newTodo]);
    setInputValue("");
    setNextId(prev => prev + 1);
  };

  const handleToggle = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDelete = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const handleClearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  // ============================================================
  // 5. RENDER
  // ============================================================
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #f5efe6;
          min-height: 100vh;
          background-image: radial-gradient(circle at 20% 20%, #eedfc8 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, #e8d5bd 0%, transparent 50%);
        }
        input::placeholder { color: #c0b6a8; }
        input:focus { outline: none; }
        input:focus-within + button { color: #c07a3a; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "60px 20px",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ width: "100%", maxWidth: "460px" }}>

          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#b0a090",
              marginBottom: "6px",
            }}>
              Today's list
            </p>
            <h1 style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "38px",
              fontWeight: 600,
              color: "#3d3530",
              lineHeight: 1.1,
            }}>
              My Todos
            </h1>
            <p style={{
              fontFamily: "'Lora', Georgia, serif",
              fontStyle: "italic",
              fontSize: "14px",
              color: "#b0a090",
              marginTop: "6px",
            }}>
              {activeCount === 0 ? "All caught up! 🎉" : `${activeCount} task${activeCount !== 1 ? "s" : ""} remaining`}
            </p>
          </div>

          {/* Input */}
          <div style={{
            display: "flex",
            background: "white",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
            marginBottom: "12px",
          }}>
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAdd()}
              placeholder="Add a new task..."
              style={{
                flex: 1,
                border: "none",
                padding: "16px 18px",
                fontSize: "15px",
                fontFamily: "'DM Sans', sans-serif",
                color: "#3d3530",
                background: "transparent",
              }}
            />
            <button
              onClick={handleAdd}
              style={{
                background: "#c07a3a",
                border: "none",
                color: "white",
                padding: "0 20px",
                fontSize: "22px",
                cursor: "pointer",
                transition: "background 0.2s",
                fontWeight: 300,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#a8622c")}
              onMouseLeave={e => (e.currentTarget.style.background = "#c07a3a")}
              aria-label="Add todo"
            >
              +
            </button>
          </div>

          {/* Filter bar */}
          <div style={{
            display: "flex",
            gap: "4px",
            marginBottom: "12px",
            padding: "4px",
            background: "rgba(255,255,255,0.5)",
            borderRadius: "24px",
            width: "fit-content",
          }}>
            {(["all", "active", "completed"] as FilterType[]).map(f => (
              <FilterButton
                key={f}
                label={f}
                active={filter === f}
                onClick={() => setFilter(f)}
              />
            ))}
          </div>

          {/* Todo list */}
          <div style={{
            background: "white",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
            marginBottom: "12px",
          }}>
            {filteredTodos.length === 0 ? (
              <div style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "#c0b6a8",
                fontFamily: "'Lora', serif",
                fontStyle: "italic",
                fontSize: "15px",
              }}>
                {filter === "completed" ? "No completed tasks yet." : "Nothing here — add something above!"}
              </div>
            ) : (
              filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {todos.some(t => t.completed) && (
            <div style={{ textAlign: "right" }}>
              <button
                onClick={handleClearCompleted}
                style={{
                  background: "none",
                  border: "none",
                  color: "#b0a090",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.05em",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                Clear completed
              </button>
            </div>
          )}

          {/* Learning annotations */}
          <div style={{
            marginTop: "40px",
            padding: "20px",
            background: "rgba(255,255,255,0.6)",
            borderRadius: "12px",
            borderLeft: "3px solid #c07a3a",
          }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#c07a3a", marginBottom: "10px", fontWeight: 600 }}>
              Concepts in this file
            </p>
            {[
              "TypeScript interfaces for Todo, props",
              "useState — local component state",
              "useEffect — syncing side effects",
              "Derived state — computed from todos[]",
              "Array methods: map, filter, spread",
              "Lifting state up to parent component",
              "Props & event handler patterns",
            ].map((concept, i) => (
              <p key={i} style={{ fontSize: "13px", color: "#7a6f65", marginBottom: "4px", fontFamily: "'DM Sans', sans-serif" }}>
                → {concept}
              </p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}