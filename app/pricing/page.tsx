import { Nav } from "@/components/Nav";

export default function PricingPage() {
  return (
    <main className="shell light">
      <Nav mode="light" />
      <div className="container">
        <section className="page-hero">
          <div className="page-hero-row">
            <h1 className="page-title">Assinatura Mensal</h1>
            <p className="muted">
              Acesso completo ao portal de notícias regulatórias, filtros por agência e histórico consolidado.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="grid two">
            <article className="card">
              <p className="eyebrow">Nery Regulatory Intelligence</p>
              <h2>Plano Mensal</h2>
              <p>
                Monitoramento das 11 agências reguladoras federais, com fonte oficial, resumo editorial e atualização
                programada 3 vezes ao dia.
              </p>
              <form action="/api/stripe/checkout" method="post">
                <button className="btn dark" type="submit">
                  Assinar com Stripe
                </button>
              </form>
            </article>
            <article className="card">
              <h3>Inclui</h3>
              <p>Área protegida para assinantes, filtros, links oficiais, histórico de ingestão e curadoria posterior.</p>
              <p className="notice">
                Configure `STRIPE_SECRET_KEY`, `STRIPE_MONTHLY_PRICE_ID`, `STRIPE_WEBHOOK_SECRET` e
                `NEXT_PUBLIC_SITE_URL` para ativar pagamentos reais.
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
