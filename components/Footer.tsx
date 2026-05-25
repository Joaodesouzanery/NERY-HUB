import Link from "next/link";

export function Footer({ mode = "dark" }: { mode?: "dark" | "light" }) {
  return (
    <footer className={`site-footer footer-${mode}`}>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="fbrand-name">NERY</span>
            <p>Software fundacional para o amanhã.<br />Entregue hoje.™</p>
          </div>
          <div className="footer-col">
            <h5>Plataformas</h5>
            <Link href="/saneamento">Saneamento</Link>
            <Link href="/regulatorio">Setor Regulatório</Link>
            <Link href="/">Página Inicial</Link>
            <Link href="/regulatorio">Data Protection</Link>
          </div>
          <div className="footer-col">
            <h5>Empresa</h5>
            <Link href="/">Sobre Nós</Link>
            <Link href="/">Notícias e Portais</Link>
            <Link href="/account">Minha Conta</Link>
          </div>
          <div className="footer-col">
            <h5>Legal</h5>
            <Link href="/privacidade">Política de Privacidade</Link>
            <Link href="/">Termos de Serviço</Link>
            <Link href="/">Cookies</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 NERY. Todos os direitos reservados.</span>
          <span>Made in Brazil</span>
        </div>
      </div>
    </footer>
  );
}
