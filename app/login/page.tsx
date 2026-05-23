import { Nav } from "@/components/Nav";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<{ message?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="shell light">
      <Nav mode="light" />
      <div className="container">
        <section className="page-hero">
          <h1 className="page-title">Entrar</h1>
          <p className="muted">Use e-mail mágico do Supabase para acessar sua assinatura.</p>
        </section>
        <section className="section">
          {params?.message ? <p className="locked">{params.message}</p> : null}
          <form className="form" action="/api/auth/login" method="post">
            <input type="email" name="email" placeholder="seu@email.com" required />
            <button className="btn dark" type="submit">
              Enviar link de acesso
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
