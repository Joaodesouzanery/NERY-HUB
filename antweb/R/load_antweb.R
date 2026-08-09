# load_antweb.R
# Carrega os dados organizados (Serrapilheira + AntWeb) em data.frames de R.
# Gerado por antweb/build.py. Rode a partir da raiz do repositório:
#     source("antweb/R/load_antweb.R")
#
# Requer apenas base R (utils::read.csv). Opcionalmente usa jsonlite/httr
# para (re)consultar a API do AntWeb ao vivo — veranexo no fim do arquivo.

antweb_dir <- file.path("antweb", "output")
if (!dir.exists(antweb_dir)) {
  # fallback: rodando de dentro de antweb/R
  antweb_dir <- normalizePath(file.path("..", "output"), mustWork = FALSE)
}

read_or_empty <- function(name) {
  path <- file.path(antweb_dir, name)
  if (file.exists(path)) {
    utils::read.csv(path, stringsAsFactors = FALSE, encoding = "UTF-8")
  } else {
    warning(sprintf("Arquivo nao encontrado: %s", path))
    data.frame()
  }
}

observacoes <- read_or_empty("observacoes.csv")
taxa        <- read_or_empty("taxa.csv")
specimens   <- read_or_empty("specimens.csv")

# Tipagem util
num_cols <- c("campanha", "ponto", "comportamento", "distancia_m",
              "hora_comportamento", "abund")
for (nm in intersect(num_cols, names(observacoes))) {
  observacoes[[nm]] <- suppressWarnings(as.numeric(observacoes[[nm]]))
}
for (nm in intersect(c("subfamily", "ant_genus", "ant_species", "area_verde",
                       "isca", "functional"), names(observacoes))) {
  observacoes[[nm]] <- as.factor(observacoes[[nm]])
}

cat(sprintf("Observacoes: %d linhas\n", nrow(observacoes)))
cat(sprintf("Taxa: %d\n", nrow(taxa)))
cat(sprintf("Specimens (AntWeb): %d\n", nrow(specimens)))

# Salva um .RData consolidado para reuso rapido
save(observacoes, taxa, specimens,
     file = file.path(antweb_dir, "antweb_dataset.RData"))
cat(sprintf("Salvo: %s\n", file.path(antweb_dir, "antweb_dataset.RData")))

# ------------------------------------------------------------------------------
# ANEXO (opcional): consultar a API do AntWeb ao vivo direto do R.
# Descomente e instale: install.packages(c("httr", "jsonlite"))
#
# antweb_fetch <- function(genus, limit = 100, offset = 0) {
#   resp <- httr::GET("https://www.antweb.org/api/v2/",
#                     query = list(genus = tolower(genus),
#                                  limit = limit, offset = offset))
#   httr::stop_for_status(resp)
#   jsonlite::fromJSON(httr::content(resp, as = "text", encoding = "UTF-8"),
#                      simplifyVector = FALSE)
# }
# pheidole <- antweb_fetch("pheidole", limit = 10)
# str(pheidole$count)
