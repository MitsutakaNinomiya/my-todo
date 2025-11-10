// App.tsx
import { useState, useEffect } from "react";

// ① 先に型を定義（type: 型定義）
type Todo = {
  id: string;   // unique id（ユニークID）
  title: string; // task title（タスク名）
};

export default function App() {
  const [text, setText] = useState("");

  // ② Todo[] で初期化。旧データ（string配列）もマイグレーション（migration：移行）対応
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem("todos");
      if (!saved) return []; // 
      const parsed = JSON.parse(saved); 
      if (!Array.isArray(parsed)) return [];

      // 旧：string[] → 新：Todo[] に変換
      if (parsed.length > 0 && typeof parsed[0] === "string") {
        return (parsed as string[]).map((title, idx) => ({
          id: `${Date.now()}-${idx}-${Math.random().toString(36).slice(2)}`,
          title,
        }));
      }

      return parsed as Todo[];
    } catch {
      return [];
    }
  });

  // ③ 追加：オブジェクト {id, title} を push
  const addTodo = () => {
    const title = text.trim(); // trim（前後空白除去）
    if (!title) return;

    // ※ テンプレートリテラルは `` バッククォート！
    const newTodo: Todo = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title,
    };

    setTodos((prev) => [...prev, newTodo]); // spread（スプレッド：配列展開）
    setText("");
  };

  // ④ 削除：id で filter（フィルター：絞り込み）
  const removeTodoById = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // ⑤ 永続化：useEffect（ユーズエフェクト：副作用フック）
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
            <span style={{ flex: 1 }}>{t.title}</span>
            <button onClick={() => removeTodoById(t.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
