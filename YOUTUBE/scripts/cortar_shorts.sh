#!/usr/bin/env bash
# Corta Shorts verticais (9:16) a partir de um vídeo longo, usando FFmpeg.
# Requer: ffmpeg instalado.
#
# Uso:
#   ./cortar_shorts.sh video_completo.mp4
#
# Edite os PARES de tempo abaixo (inicio fim) com os trechos que o roteiro sugeriu
# em "shorts_sugeridos". Cada par vira um Short recortado e reenquadrado pra vertical.

set -euo pipefail

VIDEO="${1:?Uso: ./cortar_shorts.sh video_completo.mp4}"
SAIDA_DIR="shorts_$(basename "${VIDEO%.*}")"
mkdir -p "$SAIDA_DIR"

# Trechos: "HH:MM:SS HH:MM:SS" (inicio fim). Ajuste conforme o roteiro.
PARES=(
  "00:00:40 00:01:25"
  "00:02:10 00:02:55"
  "00:03:30 00:04:10"
)

i=1
for par in "${PARES[@]}"; do
  set -- $par
  INICIO="$1"; FIM="$2"
  SAIDA="$SAIDA_DIR/short_${i}.mp4"
  echo "Cortando Short $i: $INICIO -> $FIM"
  # -ss/-to recorta; o filtro corta pro centro e escala pra 1080x1920 (9:16).
  ffmpeg -y -i "$VIDEO" -ss "$INICIO" -to "$FIM" \
    -vf "crop='min(iw,ih*9/16)':'min(ih,iw*16/9)',scale=1080:1920,setsar=1" \
    -c:v libx264 -preset veryfast -crf 20 -c:a aac -b:a 128k \
    "$SAIDA"
  i=$((i+1))
done

echo "Pronto. Shorts em: $SAIDA_DIR/"
echo "Dica: pra legendas automáticas e polimento, importe cada Short no CapCut."
