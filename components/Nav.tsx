import Link from "next/link";

type NavProps = {
  mode?: "dark" | "light";
  blogLabel?: boolean;
};

export function Nav({ mode = "dark", blogLabel = false }: NavProps) {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link className="brand" href="/">
          NERY {blogLabel ? <span>/ Nery Blog</span> : null}
        </Link>
        <div className="nav-links">
          <Link href="/#platforms">Plataformas</Link>
          <Link href="/#bootcamps">Bootcamps</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/noticias">Notícias</Link>
          <Link href="/pricing" className={mode === "light" ? "btn dark" : "btn primary"}>
            Assinar
          </Link>
        </div>
      </div>
    </nav>
  );
}
