"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NavProps = {
  mode?: "dark" | "light";
  blogLabel?: boolean;
};

function SearchIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8h16M4 16h16" />
    </svg>
  );
}

export function Nav({ mode = "dark", blogLabel = false }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`main-nav ${mode} ${scrolled ? "scrolled" : ""}`}>
        <div className="container nav-inner">
          <Link className="nav-logo" href="/" onClick={closeMenu}>
            <span>NERY</span>
            {blogLabel ? (
              <>
                <span className="slash">/</span>
                <span className="sub">Nery Blog</span>
              </>
            ) : null}
          </Link>

          <ul className="nav-links">
            <li><Link href="/">Início</Link></li>
            <li><Link href="/regulatorio">Regulatório</Link></li>
            <li><Link href="/saneamento">Saneamento</Link></li>
            <li><Link href="/account">Conta</Link></li>
          </ul>

          <div className="nav-actions">
            <Link className="btn-nav" href="/pricing">Assinar</Link>
            <button className="btn-icon-nav" type="button" aria-label="Buscar notícias">
              <SearchIcon />
              <span className="nav-divider" />
              <MenuIcon />
            </button>
            <button
              className="mobile-menu-btn"
              type="button"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((current) => !current)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${mode} ${menuOpen ? "open" : ""}`}>
        <Link href="/" onClick={closeMenu}>Início</Link>
        <Link href="/regulatorio" onClick={closeMenu}>Regulatório</Link>
        <Link href="/saneamento" onClick={closeMenu}>Saneamento</Link>
        <Link href="/account" onClick={closeMenu}>Minha Conta</Link>
        <Link className="btn-primary mobile-cta" href="/pricing" onClick={closeMenu}>Assinar</Link>
      </div>
    </>
  );
}
