// App.tsx
import { useState, useEffect } from "react";

// ① 型定義（type: 型定義）
type Todo = {
  id: string;     // unique id（ユニークID）
  title: string;  // task title（タスク名）
  done: boolean;  // done flag（完了フラグ）
};

export default function App() {
  const [text, setText] = useState("");

  // ② 初期化（旧データのマイグレーション：migration/移行）
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem("todos");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];

      // 旧: string[] → 新: Todo[]
      if (parsed.length > 0 && typeof parsed[0] === "string") {
        return (parsed as string[]).map((title, idx) => ({
          id: `${Date.now()}-${idx}-${Math.random().toString(36).slice(2)}`,
          title,
          done: false,
        }));
      }

      // 旧: {id,title} だけの配列 → done を補完
      return (parsed as any[]).map((t) => ({
        id: t.id,
        title: t.title,
        done: typeof t.done === "boolean" ? t.done : false,
      })) as Todo[];
    } catch {
      return [];
    }
  });

  // ③ 追加（add）
  const addTodo = () => {
    const title = text.trim(); // trim（前後空白除去）
    if (!title) return;

    const newTodo: Todo = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title,
      done: false, // 追加：常に未完で作成
    };

    setTodos((prev) => [...prev, newTodo]); // spread（スプレッド：配列展開）
    setText("");
  };

  // ④ 完了切替（toggle：ON/OFF切替）
  const toggleDone = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  // ⑤ 削除（remove）
  const removeTodoById = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // ⑥ 永続化（useEffect：副作用フック）
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <div style={{ padding: 20, maxWidth: 420, margin: "40px auto" }}>
      <h1>Todo</h1>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="やることを入力"
          onKeyDown={(e) => e.key === "Enter" && addTodo()} // Enterで追加
          style={{ flex: 1 }}
        />
        <button onClick={addTodo}>追加</button>
      </div>

      <ul style={{ marginTop: 16, paddingLeft: 16 }}>
        {todos.map((t) => (
          <li key={t.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* 完了切替（checkbox：チェックボックス） */}
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleDone(t.id)}
              aria-label="完了切替"
            />
            <span
              style={{
                flex: 1,
                textDecoration: t.done ? "line-through" : "none", // 取り消し線
                opacity: t.done ? 0.6 : 1,
              }}
            >
              {t.title}
            </span>
            <button onClick={() => removeTodoById(t.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
