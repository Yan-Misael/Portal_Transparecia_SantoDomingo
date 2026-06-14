#!/usr/bin/env bash
# ============================================================================
#  empaquetar.sh — Genera el .zip final de entrega del proyecto.
#
#  Uso:
#     bash empaquetar.sh
#
#  Debe ejecutarse desde la raíz del proyecto (donde está docker-compose.yml).
#  Produce ../Portal_Transparencia_SantoDomingo_Final.zip con la estructura
#  correcta, excluyendo artefactos pesados (node_modules, dist, .git) pero
#  CONSERVANDO los archivos .env para que el proyecto se pueda levantar tal cual.
#
#  Nota: el .zip incluye .env por comodidad de evaluación. En GitHub, los .env
#  quedan excluidos por los .gitignore correspondientes (no subir secretos).
# ============================================================================
set -euo pipefail

# Nombre de la carpeta raíz del proyecto y del zip resultante.
PROJECT_NAME="Portal_Transparencia_SantoDomingo_Final"

# Directorio donde está este script (= raíz del proyecto).
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(dirname "$ROOT_DIR")"
ZIP_PATH="$PARENT_DIR/${PROJECT_NAME}.zip"

echo "→ Raíz del proyecto: $ROOT_DIR"
echo "→ Zip de salida:     $ZIP_PATH"

# Verificación mínima de que estamos en el lugar correcto.
if [[ ! -f "$ROOT_DIR/docker-compose.yml" ]]; then
  echo "✗ No se encontró docker-compose.yml. Ejecute el script desde la raíz del proyecto." >&2
  exit 1
fi

# Eliminar un zip previo si existe.
rm -f "$ZIP_PATH"

# Empaquetar desde el directorio padre para que el zip contenga la carpeta
# raíz del proyecto (y no su contenido suelto).
cd "$PARENT_DIR"

zip -r -q "$ZIP_PATH" "$(basename "$ROOT_DIR")" \
  -x "*/node_modules/*" \
  -x "*/dist/*" \
  -x "*/.git/*" \
  -x "*/*.log"

echo "✓ Empaquetado completo."
echo "  Archivo: $ZIP_PATH"
echo "  Tamaño:  $(du -h "$ZIP_PATH" | cut -f1)"
