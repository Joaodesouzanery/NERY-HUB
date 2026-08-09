# AntWeb × Serrapilheira (Observação Focal)

Integração com a **API do AntWeb** (https://www.antweb.org/api.do) para enriquecer
a planilha de observação focal de formigas de serrapilheira. O pipeline:

1. **Organiza** a planilha de observação focal (normaliza subfamília/gênero/
   morfoespécie, unifica separadores, remove linhas `na`, padroniza áreas e tipos).
2. **Extrai** os táxons presentes (subfamília → gênero → morfoespécie).
3. **Puxa do AntWeb** todos os *specimens* de cada gênero: nomes, taxonomia,
   localidade, casta, metadados e **URLs de imagens**, incluindo a
   **Favorite Image** (imagem representativa).
4. **Monta** um `.xlsx` organizado com abas `Observacoes`, `Taxa`, `Specimens`,
   `Imagens` (com miniaturas embutidas) e `Dicionario`.
5. **Exporta para R**: CSVs + `R/load_antweb.R` que carrega os `data.frame`s e
   salva um `antweb_dataset.RData`.

## Estrutura

```
antweb/
├── antweb_client.py   # cliente da API v2 do AntWeb (paginação, retries, imagens)
├── build.py           # pipeline principal (limpeza + enriquecimento + xlsx + R)
├── mock_session.py    # sessão HTTP falsa p/ validar offline
├── mock_fixtures.json # dados de exemplo (estrutura idêntica à API real)
├── requirements.txt
├── R/load_antweb.R    # carrega os CSVs em R e gera .RData
└── output/            # .xlsx, .csv, manifest.json (gerados)
```

## Como rodar

```bash
pip install -r antweb/requirements.txt

# COM rede (fala com o AntWeb real):
python antweb/build.py --xlsx antweb/Tabela_Serrapilheira_Observacao_Focal.xlsx --download-images

# Amostra de demonstração (limita specimens por gênero):
python antweb/build.py --xlsx <planilha.xlsx> --max-per-taxon 50 --download-images

# OFFLINE / validação do pipeline (sem rede, usa fixtures):
python antweb/build.py --xlsx <planilha.xlsx> --mock
```

Depois, em R (a partir da raiz do repositório):

```r
source("antweb/R/load_antweb.R")
# -> observacoes, taxa, specimens (data.frames) + antweb/output/antweb_dataset.RData
```

## API do AntWeb (v2)

- Base: `https://www.antweb.org/api/v2/`
- Parâmetros: `taxonName, subfamily, genus, species, country, adm1, bbox,
  habitat, elevation, dateStart, dateEnd, dateUpdate, limit (≤1000), offset`.
- Resposta: `{ "count": N, "results": [ {specimen} ] }`, cada specimen com
  bloco `images` → `shot_types` (`h` cabeça, `p` perfil, `d` dorsal, `l` etiqueta),
  cada tomada com URLs em `thumbview/low/med/high`.
- **Favorite Image**: quando a API sinaliza a imagem representativa, ela é usada;
  caso contrário escolhemos a melhor tomada de **perfil** em alta resolução
  (`antweb_client.pick_favorite_image`).

## ⚠️ Nota de rede

O ambiente onde este código foi montado **bloqueia `antweb.org`** (proxy de
egress → 403), então a chamada real não pôde ser executada aqui. O pipeline foi
validado ponta a ponta em modo `--mock` (fixtures com a mesma estrutura JSON da
API). Na sua máquina/deploy com acesso à internet, rode **sem** `--mock` para
puxar os dados reais — nenhuma alteração de código é necessária.

Se os nomes de campos/endpoint da API mudarem, ajuste as constantes no topo de
`antweb_client.py` (`API_V2_BASE`, `IMG_SIZE_PREFERENCE`, `SHOT_PREFERENCE`);
o parsing é defensivo e tolera variações de chaves (`results`/`specimens`,
`decimal_latitude`/`geojson`, etc.).
