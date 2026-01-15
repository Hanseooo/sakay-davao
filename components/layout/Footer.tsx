

export default function Footer() {

    return (
      <footer className="w-full text-xs text-muted-foreground py-8 mt-12 text-center border-t border-border/40 flex flex-col">
        <p className="tracking-widest uppercase mb-1">
          Sakay Davao &bull; 2026
        </p>
        <div className="flex flex-wrap justify-center items-center gap-2">
        <span>Developed by Hanseo</span>
        <span className="opacity-50">•</span>
        <a
          href="https://github.com/Hanseooo"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          GitHub
        </a>
        <span className="opacity-50">•</span>
        <a
          href="https://linkedin.com/in/hanseooo"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          LinkedIn
        </a>
        <span className="opacity-50">•</span>
        <a
          href="https://hanseo.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Portfolio
        </a>
      </div>
      </footer>
    )
}