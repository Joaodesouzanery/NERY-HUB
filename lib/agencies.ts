export type AgencyCode =
  | "ANA"
  | "ANAC"
  | "ANCINE"
  | "ANEEL"
  | "ANM"
  | "ANP"
  | "ANS"
  | "ANATEL"
  | "ANTAQ"
  | "ANTT"
  | "ANVISA";

export type Agency = {
  code: AgencyCode;
  name: string;
  sector: string;
  newsUrl: string;
  rssUrl?: string;
};

export const REGULATORY_AGENCIES: Agency[] = [
  {
    code: "ANA",
    name: "Agência Nacional de Águas e Saneamento Básico",
    sector: "Águas e saneamento",
    newsUrl: "https://www.gov.br/ana/pt-br/assuntos/noticias-e-eventos/noticias"
  },
  {
    code: "ANAC",
    name: "Agência Nacional de Aviação Civil",
    sector: "Aviação civil",
    newsUrl: "https://www.gov.br/anac/pt-br/noticias"
  },
  {
    code: "ANCINE",
    name: "Agência Nacional do Cinema",
    sector: "Audiovisual",
    newsUrl: "https://www.gov.br/ancine/pt-br/assuntos/noticias"
  },
  {
    code: "ANEEL",
    name: "Agência Nacional de Energia Elétrica",
    sector: "Energia elétrica",
    newsUrl: "https://www.gov.br/aneel/pt-br/assuntos/noticias"
  },
  {
    code: "ANM",
    name: "Agência Nacional de Mineração",
    sector: "Mineração",
    newsUrl: "https://www.gov.br/anm/pt-br/assuntos/noticias"
  },
  {
    code: "ANP",
    name: "Agência Nacional do Petróleo, Gás Natural e Biocombustíveis",
    sector: "Petróleo e gás",
    newsUrl: "https://www.gov.br/anp/pt-br/canais_atendimento/imprensa/noticias-comunicados"
  },
  {
    code: "ANS",
    name: "Agência Nacional de Saúde Suplementar",
    sector: "Saúde suplementar",
    newsUrl: "https://www.gov.br/ans/pt-br/assuntos/noticias"
  },
  {
    code: "ANATEL",
    name: "Agência Nacional de Telecomunicações",
    sector: "Telecomunicações",
    newsUrl: "https://www.gov.br/anatel/pt-br/assuntos/noticias"
  },
  {
    code: "ANTAQ",
    name: "Agência Nacional de Transportes Aquaviários",
    sector: "Transportes aquaviários",
    newsUrl: "https://www.gov.br/antaq/pt-br/noticias"
  },
  {
    code: "ANTT",
    name: "Agência Nacional de Transportes Terrestres",
    sector: "Transportes terrestres",
    newsUrl: "https://www.gov.br/antt/pt-br/assuntos/noticias"
  },
  {
    code: "ANVISA",
    name: "Agência Nacional de Vigilância Sanitária",
    sector: "Vigilância sanitária",
    newsUrl: "https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa"
  }
];
