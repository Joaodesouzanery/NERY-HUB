import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { PRODUCTS, isProductCode, type ProductCode } from "@/lib/catalog";
import { hasStripeEnv } from "@/lib/stripe";
import { hasSupabaseServiceEnv } from "@/lib/supabase/server";

export default async function PricingPage({
  searchParams
}: {
  searchParams?: Promise<{ access?: string; product?: string; checkout?: string }>;
}) {
  const params = await searchParams;
  const selected: ProductCode | undefined = params?.product && isProductCode(params.product) ? params.product : undefined;
  const checkoutReady = hasStripeEnv && hasSupabaseServiceEnv;

  return (
    <main className="product-view view-active">
      <Nav mode="light" />
      <header className="product-header">
        <div className="container product-header-row">
          <h1 className="page-title">Assinaturas</h1>
          <p className="product-description">Escolha um portal. Cada assinatura libera somente seu próprio feed, filtros e histórico.</p>
        </div>
      </header>
      <section className="product-section">
        <div className="container">
          {params?.access === "required" ? <p className="message">Uma assinatura ativa deste portal é necessária para acessar o feed completo.</p> : null}
          {params?.checkout === "cancelled" ? <p className="message">A assinatura não foi concluída. Você pode retomar quando desejar.</p> : null}
          {!checkoutReady || params?.checkout === "unavailable" ? (
            <p className="message">As assinaturas estão em preparação. O checkout será habilitado após a configuração segura do pagamento e do acesso ao portal.</p>
          ) : null}
          <div className="pricing-products">
            {(["regulatorio", "saneamento"] as const).map((product) => (
              <article className={`plan-panel ${selected === product ? "selected" : ""}`} key={product}>
                <p className="eyebrow">Nery {PRODUCTS[product].shortName}</p>
                <h2>{PRODUCTS[product].shortName}</h2>
                <p>
                  {PRODUCTS[product].description}{" "}
                  {checkoutReady
                    ? "Atualização três vezes ao dia e acesso atribuído às fontes."
                    : "A coleta e o acesso serão ativados após validação técnica e editorial."}
                </p>
                {checkoutReady ? (
                  <form action="/api/stripe/checkout" method="post">
                    <input type="hidden" name="product" value={product} />
                    <button className="btn-dark" type="submit">Assinar com Stripe</button>
                  </form>
                ) : (
                  <button className="btn-disabled" type="button" disabled>Em preparação</button>
                )}
              </article>
            ))}
          </div>
          <p className="pricing-note">
            {checkoutReady ? <>Já é assinante? <Link className="link-underline" href="/login">Entre na sua conta</Link>.</> : "Avisaremos quando as assinaturas estiverem disponíveis."}
          </p>
          <p className="legal-note">
            Antes de contratar, consulte nossa <Link className="link-underline" href="/privacidade">Política de Privacidade</Link>.
          </p>
        </div>
      </section>
      <Footer mode="light" />
    </main>
  );
}
