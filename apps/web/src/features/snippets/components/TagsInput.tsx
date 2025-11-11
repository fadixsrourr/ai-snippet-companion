import { useState } from "react"

export function TagsInput({
  value,
  onChange,
  placeholder = "Add tags…",
}: {
  value: string[]
  onChange: (v: string[]) => void
  placeholder?: string
}) {
  const [draft, setDraft] = useState("")

  const add = (t: string) => {
    const tag = t.trim()
    if (!tag) return
    if (value.includes(tag)) return
    onChange([...value, tag])
    setDraft("")
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      e.preventDefault()
      add(draft)
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md bg-neutral-800 px-2 py-2">
      {value.map((t) => (
        <span key={t} className="px-2 py-1 text-xs rounded bg-neutral-700">{t}</span>
      ))}
      <input
        className="flex-1 bg-transparent outline-none px-2 py-1 text-sm"
        placeholder={placeholder}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}
