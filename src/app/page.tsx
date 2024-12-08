"use client";
import React, { useState } from "react";
import { trpc } from "./trpc";
import {
  CheckCircle2,
  Circle,
  Trash2,
  PlusCircle,
  ListTodo,
} from "lucide-react";

export default function TodoPage() {
  const [title, setTitle] = useState("");
  const utils = trpc.useContext();

  const { data: todos = [], isLoading } = trpc.todo.getAll.useQuery();
  const createTodo = trpc.todo.create.useMutation({
    onSuccess: () => {
      utils.todo.getAll.invalidate();
      setTitle("");
    },
  });

  const updateTodoStatus = trpc.todo.update.useMutation({
    onSuccess: () => {
      utils.todo.getAll.invalidate();
    },
  });

  const deleteTodo = trpc.todo.delete.useMutation({
    onSuccess: () => {
      utils.todo.getAll.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      createTodo.mutate({ title });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Modern Header */}
        <div className="bg-neutral-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ListTodo className="w-8 h-8" />
            <h1 className="text-3xl font-bold tracking-tight">Task Manager</h1>
          </div>
          <div className="text-neutral-400">
            {todos.filter((todo) => !todo.completed).length} Pending
          </div>
        </div>

        {/* Input Section */}
        <form
          onSubmit={handleSubmit}
          className="p-6 border-b border-neutral-200 bg-neutral-100"
        >
          <div className="flex items-center space-x-4 bg-white rounded-lg shadow-sm border border-neutral-200">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a new task"
              className="flex-grow px-4 py-3 rounded-lg text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            />
            <button
              type="submit"
              className="p-3 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <PlusCircle size={24} />
            </button>
          </div>
        </form>

        {/* Todo List */}
        <div className="divide-y divide-neutral-200">
          {isLoading ? (
            <div className="text-center py-8 text-neutral-500 animate-pulse">
              Loading tasks...
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              No tasks. Start by adding a new one!
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="group flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-grow">
                  <button
                    onClick={() =>
                      updateTodoStatus.mutate({
                        id: todo.id,
                        completed: !todo.completed,
                      })
                    }
                    className="focus:outline-none"
                  >
                    {todo.completed ? (
                      <CheckCircle2
                        size={24}
                        className="text-emerald-500 transition-transform group-hover:scale-110"
                      />
                    ) : (
                      <Circle
                        size={24}
                        className="text-neutral-400 transition-transform group-hover:scale-110"
                      />
                    )}
                  </button>
                  <span
                    className={`text-lg flex-grow ${
                      todo.completed
                        ? "line-through text-neutral-400 italic"
                        : "text-neutral-800"
                    }`}
                  >
                    {todo.title}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo.mutate({ id: todo.id })}
                  className="text-neutral-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {todos.length > 0 && (
          <div className="p-4 text-center text-neutral-500 bg-neutral-100 border-t border-neutral-200">
            <span className="text-sm">
              {todos.filter((todo) => !todo.completed).length} tasks remaining
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
