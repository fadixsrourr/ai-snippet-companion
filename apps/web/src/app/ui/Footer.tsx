export default function Footer() {
  return (
    <footer className="border-t border-neutral-900/60 bg-neutral-950/50 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-neutral-500">
        Built with 💙 by{" "}
        <a
          href="https://your-link-here" // replace with your link or GitHub
          target="_blank"
          rel="noreferrer"
          className="text-neutral-300 hover:text-cyan-300 transition-colors"
        >
          Fadi Srour
        </a>
      </div>
    </footer>
  );
}
