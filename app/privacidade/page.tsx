import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export default function PrivacyPage() {
  return (
    <main className="product-view view-active">
      <Nav mode="light" />
      <header className="product-header">
        <div className="container product-header-row">
          <h1 className="page-title">Privacidade</h1>
          <p className="product-description">Aviso de privacidade para as áreas de conta e assinatura dos Portais NERY.</p>
        </div>
      </header>
      <section className="product-section">
        <div className="container privacy-copy">
          <p><strong>Status atual:</strong> login e pagamentos ainda não estão ativos. Este aviso passa a reger esses serviços quando forem habilitados.</p>

          <h2>Dados tratados</h2>
          <p>Quando o acesso for habilitado, poderemos tratar e-mail de autenticação, identificadores de usuário e assinatura, status de acesso, registros técnicos de segurança e atendimento.</p>
          <p>Pagamentos serão processados pela Stripe. A NERY não armazenará os dados completos do cartão.</p>

          <h2>Finalidades</h2>
          <ul>
            <li>Autenticar usuários e liberar o produto contratado.</li>
            <li>Processar e acompanhar assinaturas, cancelamentos e expiração de acesso.</li>
            <li>Proteger a plataforma, prevenir fraude e manter registros operacionais.</li>
            <li>Atender solicitações relacionadas a privacidade e suporte.</li>
          </ul>

          <h2>Minimização e retenção</h2>
          <p>Serão coletados somente dados necessários para entregar o serviço e cumprir obrigações aplicáveis. Os períodos de retenção serão definidos antes da ativação comercial e limitados à finalidade correspondente.</p>

          <h2>Direitos e contato</h2>
          <p>Antes da ativação do produto, a NERY publicará o canal de contato para solicitações de confirmação, acesso, correção, eliminação, informação sobre compartilhamento e demais direitos previstos na LGPD.</p>

          <p className="notice">Este aviso é informativo de pré-lançamento e deverá ser revisado antes da coleta efetiva de dados pessoais ou do início de assinaturas.</p>
        </div>
      </section>
      <Footer mode="light" />
    </main>
  );
}
