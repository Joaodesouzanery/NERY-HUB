export type ProductCode = "regulatorio" | "saneamento";

export type Product = {
  code: ProductCode;
  name: string;
  shortName: string;
  description: string;
  feedTitle: string;
};

export const PRODUCTS: Record<ProductCode, Product> = {
  regulatorio: {
    code: "regulatorio",
    name: "Portal de Notícias Regulatórias",
    shortName: "Regulatório",
    description: "Monitoramento das 12 agências reguladoras federais com fontes oficiais, filtros e histórico.",
    feedTitle: "Notícias Regulatórias"
  },
  saneamento: {
    code: "saneamento",
    name: "Portal de Notícias de Saneamento",
    shortName: "Saneamento",
    description: "Notícias, estudos e atos de mercado que impactam saneamento básico, concessões e operações.",
    feedTitle: "Notícias de Saneamento"
  }
};

export function isProductCode(value: string): value is ProductCode {
  return value === "regulatorio" || value === "saneamento";
}

export type CatalogSource = {
  code: string;
  name: string;
  sector: string;
  url: string;
  products: ProductCode[];
  kind: "agency" | "government" | "legislative" | "institute" | "association" | "market";
  policy: "licensed_original" | "credited_original" | "alert_with_link";
};

export const REGULATORY_AGENCIES: CatalogSource[] = [
  ["ANA", "Agência Nacional de Águas e Saneamento Básico", "Águas e saneamento", "https://www.gov.br/ana/pt-br/assuntos/noticias-e-eventos/noticias"],
  ["ANAC", "Agência Nacional de Aviação Civil", "Aviação civil", "https://www.gov.br/anac/pt-br/noticias"],
  ["ANCINE", "Agencia Nacional do Cinema", "Audiovisual", "https://www.gov.br/ancine/pt-br/assuntos/noticias"],
  ["ANEEL", "Agência Nacional de Energia Elétrica", "Energia elétrica", "https://www.gov.br/aneel/pt-br/assuntos/noticias"],
  ["ANM", "Agência Nacional de Mineração", "Mineração", "https://www.gov.br/anm/pt-br/assuntos/noticias"],
  ["ANP", "Agência Nacional do Petróleo, Gás Natural e Biocombustíveis", "Petróleo e gás", "https://www.gov.br/anp/pt-br/canais_atendimento/imprensa/noticias-comunicados"],
  ["ANS", "Agência Nacional de Saúde Suplementar", "Saúde suplementar", "https://www.gov.br/ans/pt-br/assuntos/noticias"],
  ["ANATEL", "Agência Nacional de Telecomunicações", "Telecomunicações", "https://www.gov.br/anatel/pt-br/assuntos/noticias"],
  ["ANTAQ", "Agência Nacional de Transportes Aquaviários", "Transportes aquaviários", "https://www.gov.br/antaq/pt-br/noticias"],
  ["ANTT", "Agência Nacional de Transportes Terrestres", "Transportes terrestres", "https://www.gov.br/antt/pt-br/assuntos/ultimas-noticias"],
  ["ANVISA", "Agência Nacional de Vigilância Sanitária", "Vigilância sanitária", "https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa"],
  ["ANPD", "Agência Nacional de Proteção de Dados", "Proteção de dados", "https://www.gov.br/anpd/pt-br/assuntos/noticias"]
].map(([code, name, sector, url]) => ({
  code,
  name,
  sector,
  url,
  products: code === "ANA" ? ["regulatorio", "saneamento"] : ["regulatorio"],
  kind: "agency",
  policy: "licensed_original"
}));

export const SANITATION_SOURCES: CatalogSource[] = [
  REGULATORY_AGENCIES[0],
  {
    code: "CIDADES_SNSA",
    name: "Ministério das Cidades / SNSA",
    sector: "Política pública e SINISA",
    url: "https://www.gov.br/cidades/pt-br/assuntos/noticias-1",
    products: ["saneamento"],
    kind: "government",
    policy: "licensed_original"
  },
  {
    code: "SENADO",
    name: "Agência Senado",
    sector: "Legislativo",
    url: "https://www12.senado.leg.br/noticias/ultimas?SearchableText=saneamento",
    products: ["saneamento"],
    kind: "legislative",
    policy: "credited_original"
  },
  {
    code: "TRATA_BRASIL",
    name: "Instituto Trata Brasil",
    sector: "Estudos e indicadores",
    url: "https://tratabrasil.org.br/",
    products: ["saneamento"],
    kind: "institute",
    policy: "alert_with_link"
  },
  {
    code: "IAS",
    name: "Instituto Água e Saneamento",
    sector: "Municípios e indicadores",
    url: "https://www.aguaesaneamento.org.br/imprensa/noticias/",
    products: ["saneamento"],
    kind: "institute",
    policy: "alert_with_link"
  },
  {
    code: "ABCON_SINDCON",
    name: "ABCON SINDCON",
    sector: "Concessões e PPPs",
    url: "https://abconsindcon.com.br/noticias/",
    products: ["saneamento"],
    kind: "association",
    policy: "alert_with_link"
  },
  {
    code: "CVM",
    name: "Comissão de Valores Mobiliários",
    sector: "Atos societários",
    url: "https://sistemas.cvm.gov.br/cias-abertas.asp",
    products: ["saneamento"],
    kind: "market",
    policy: "alert_with_link"
  },
  {
    code: "SABESP_RI",
    name: "Sabesp RI",
    sector: "Resultados e fatos relevantes",
    url: "https://ri.sabesp.com.br/",
    products: ["saneamento"],
    kind: "market",
    policy: "alert_with_link"
  },
  {
    code: "SANEPAR_RI",
    name: "Sanepar RI",
    sector: "Resultados e fatos relevantes",
    url: "https://ri.sanepar.com.br/pt",
    products: ["saneamento"],
    kind: "market",
    policy: "alert_with_link"
  },
  {
    code: "COPASA_RI",
    name: "Copasa RI",
    sector: "Resultados e fatos relevantes",
    url: "https://ri.copasa.com.br/",
    products: ["saneamento"],
    kind: "market",
    policy: "alert_with_link"
  },
  {
    code: "AEGEA_RI",
    name: "Aegea RI",
    sector: "Resultados e fatos relevantes",
    url: "https://ri.aegea.com.br/informacoes-aos-investidores/",
    products: ["saneamento"],
    kind: "market",
    policy: "alert_with_link"
  },
  {
    code: "BRK_RI",
    name: "BRK Ambiental RI",
    sector: "Resultados e fatos relevantes",
    url: "https://www.ri.brkambiental.com.br/divulgacoes-e-documentos/comunicados-e-fatos-relevantes/",
    products: ["saneamento"],
    kind: "market",
    policy: "alert_with_link"
  }
];

export const PRODUCT_SOURCES: Record<ProductCode, CatalogSource[]> = {
  regulatorio: REGULATORY_AGENCIES,
  saneamento: SANITATION_SOURCES
};

export function productSectors(product: ProductCode) {
  return [...new Set(PRODUCT_SOURCES[product].map((source) => source.sector))];
}
