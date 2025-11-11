import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getPublicSnippet } from "../api/supabaseStore"
import type { Snippet } from "../types"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function PublicSnippetPage() {
  const { id } = useParams()
  const [data, setData] = useState<Snippet | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let m = true
    if (!id) return
    getPublicSnippet(id).then((d) => { if (m) { setData(d); setLoading(false) } })
  }, [id])

  if (loading) return <p className="opacity-70">Loading…</p>
  if (!data) return <p className="text-red-400">Not found or private.</p>

  return (
    <article className="space-y-3">
      <h1 className="text-2xl font-bold">{data.title}</h1>
      <p className="text-xs opacity-60">{new Date(data.created_at).toLocaleString()}</p>
      <div className="prose prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.content}</ReactMarkdown>
      </div>
      {data.tags?.length ? (
        <div className="flex gap-2">
          {data.tags.map(t => <span key={t} className="px-2 py-1 text-xs rounded bg-neutral-800">{t}</span>)}
        </div>
      ) : null}
    </article>
  )
}
