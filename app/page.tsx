import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { Nav } from "@/components/Nav";
import { getArticles } from "@/lib/news";

export default async function HomePage() {
  const articles = await getArticles({ limit: 3 });

  return (
    <main className="shell">
      <Nav />
      <section className="hero">
        <div className="container">
          <p className="eyebrow">Software Fundacional</p>
          <h1>
            Foundational
            <br />
            Software of
            <br />
            Tomorrow.
            <br />
            Delivered Today.™
          </h1>
          <p className="lead">
            We build software that empowers organizations to integrate their data, decisions, operations
            and regulatory intelligence.
          </p>
          <div className="hero-actions">
            <Link className="btn primary" href="/pricing">
              Assinar Notícias
            </Link>
            <Link className="btn" href="#platforms">
              Explore Platforms
            </Link>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="visual">
          <span>Nery Regulatory Intelligence</span>
        </div>
      </div>

      <section className="section" id="platforms">
        <div className="container">
          <p className="eyebrow">Plataformas Nery</p>
          {[
            ["Saneamento", "Gestão inteligente de infraestrutura, controle de obras e operações de saneamento em tempo real."],
            ["Regulatório", "Monitoramento automatizado das agências reguladoras federais com filtros, alertas e fontes oficiais."],
            ["Logística", "Visibilidade ponta a ponta da cadeia de suprimentos, com tomada de decisão orientada por dados."]
          ].map(([title, text]) => (
            <div className="platform-row" key={title}>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
              <Link className="btn" href={title === "Regulatório" ? "/blog" : "#"}>
                Explorar
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2>
            Tecnologia que Define
            <br />
            uma Categoria
          </h2>
          <div className="grid two" style={{ marginTop: 56 }}>
            <div className="card">
              <h3>Agregação regulatória com atribuição e rastreabilidade</h3>
              <p>
                Cada notícia mantém fonte oficial, data, agência, link público e política editorial para reduzir risco
                autoral e acelerar análise.
              </p>
            </div>
            <div className="card">
              <h3>Resumo executivo para times técnicos, jurídicos e comerciais</h3>
              <p>
                O produto prioriza síntese própria quando não houver permissão clara para republicação integral.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="bootcamps">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="eyebrow">Nery Bootcamps</p>
              <h2>
                Do zero ao caso
                <br />
                de uso em dias.
              </h2>
            </div>
            <Link className="btn primary" href="/pricing">
              Agendar um Bootcamp
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="news">
        <div className="container">
          <div className="section-header">
            <h2>Últimas Notícias</h2>
            <Link className="btn" href="/blog">
              Ver Nery Blog
            </Link>
          </div>
          <div className="grid">
            {articles.map((article) => (
              <ArticleCard article={article} key={article.id} />
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">© 2026 NERY. Software fundacional para o amanhã. Entregue hoje.™</div>
      </footer>
    </main>
  );
}
