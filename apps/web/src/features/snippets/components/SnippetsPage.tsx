import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  createSnippet,
  deleteSnippet,
  listSnippets,
  updateSnippet,
  explainSnippetStream,
} from "../api/supabaseStore";
import type { Snippet } from "../types";

function Field(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "px-3 py-2 rounded bg-neutral-900 border border-neutral-800 w-full " +
        (props.className ?? "")
      }
    />
  );
}

export default function SnippetsPage() {
  const qc = useQueryClient();
  const { data: snippets = [] } = useQuery({
    queryKey: ["snippets"],
    queryFn: listSnippets,
  });

  const createMut = useMutation({
    mutationFn: createSnippet,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["snippets"] }),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: any }) =>
      updateSnippet(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["snippets"] }),
  });

  const deleteMut = useMutation({
    mutationFn: deleteSnippet,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["snippets"] }),
  });

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const [explainingId, setExplainingId] = useState<string | null>(null);
  const [explanations, setExplanations] = useState<Record<string, string>>({});

  // --- edit state (per snippet) ---
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const onCreate = async () => {
    if (!newTitle.trim()) return;
    await createMut.mutateAsync({
      title: newTitle,
      content: newContent,
      tags: [],
      is_public: false,
    });
    setNewTitle("");
    setNewContent("");
  };

  const onExplain = async (s: Snippet) => {
    setExplainingId(s.id);
    setExplanations((e) => ({ ...e, [s.id]: "" }));
    try {
      await explainSnippetStream(s.content, (delta) => {
        setExplanations((e) => ({ ...e, [s.id]: (e[s.id] ?? "") + delta }));
      });
    } catch (e) {
      setExplanations((p) => ({ ...p, [s.id]: "Explain failed." }));
    } finally {
      setExplainingId(null);
    }
  };

  const onStartEdit = (s: Snippet) => {
    setEditingId(s.id);
    setEditTitle(s.title);
    setEditContent(s.content);
  };

  const onCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  const onSaveEdit = (s: Snippet) => {
    const patch = {
      title: editTitle,
      content: editContent,
      // keep existing flags so we don't accidentally wipe them
      tags: (s as any).tags ?? [],
      is_public: (s as any).is_public ?? false,
    };
    updateMut.mutate({ id: s.id, patch });
    setEditingId(null);
  };

  const onCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // silent fail; no toast system here by design
    }
  };

  return (
    <div className="space-y-8">
      <section className="glass rounded-xl p-5">
        <h2 className="text-xl font-semibold mb-3">New snippet</h2>
        <div className="grid gap-3">
          <Field
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Content..."
            className="px-3 py-2 rounded bg-neutral-900 border border-neutral-800 w-full min-h-[120px]"
          />
          <div className="flex gap-2">
            <button
              onClick={onCreate}
              className="px-3 py-2 rounded bg-sky-600 hover:bg-sky-500"
            >
              Create
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">My snippets</h2>
        {snippets.length === 0 ? (
          <p className="text-neutral-400">No snippets yet.</p>
        ) : (
          <ul className="grid gap-4">
            {snippets.map((s) => {
              const isEditing = editingId === s.id;
              return (
                <li key={s.id} className="glass rounded-xl p-5">
                  {/* header + actions */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      {/* title */}
                      {!isEditing ? (
                        <h3 className="font-medium text-lg break-words">
                          {s.title}
                        </h3>
                      ) : (
                        <Field
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                      )}

                      {/* content */}
                      {!isEditing ? (
                        <div className="prose prose-invert mt-2">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {s.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="mt-2 px-3 py-2 rounded bg-neutral-900 border border-neutral-800 w-full min-h-[120px]"
                        />
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                      {!isEditing ? (
                        <>
                          <button
                            onClick={() => onExplain(s)}
                            className="px-3 py-1.5 rounded bg-gradient-to-r from-teal-500 to-sky-500 text-black"
                          >
                            {explainingId === s.id ? "Explaining..." : "Explain"}
                          </button>

                          {/* NEW: Copy */}
                          <button
                            onClick={() => onCopy(s.content)}
                            className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700"
                          >
                            Copy
                          </button>

                          {/* NEW: Edit */}
                          <button
                            onClick={() => onStartEdit(s)}
                            className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteMut.mutate(s.id)}
                            className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => onSaveEdit(s)}
                            disabled={updateMut.isPending}
                            className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 disabled:opacity-60"
                          >
                            Save
                          </button>
                          <button
                            onClick={onCancelEdit}
                            disabled={updateMut.isPending}
                            className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {explanations[s.id] && !isEditing && (
                    <div className="mt-4 glass rounded-lg p-4">
                      <div className="prose prose-invert">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {explanations[s.id]}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
