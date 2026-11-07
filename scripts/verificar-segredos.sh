#!/usr/bin/env bash
# Varredura simples antes do commit: procura padrões que não devem ser publicados.
# Uso: bash scripts/verificar-segredos.sh
set -u
cd "$(dirname "$0")/.."

falhas=0
verificar() {
  local descricao="$1" padrao="$2"
  local achados
  achados=$(grep -rInE "$padrao" --exclude-dir=.git --exclude-dir=node_modules \
    --exclude=verificar-segredos.sh --exclude='*.png' --exclude='*.pdf' . || true)
  if [ -n "$achados" ]; then
    echo "⚠ $descricao"; echo "$achados" | head -20; echo; falhas=1
  fi
}

verificar "Credencial exportada do n8n"        '"credentials"[[:space:]]*:'
verificar "ID de instância do n8n"             '"instanceId"'
verificar "Chave do Google (API key)"          'AIza[0-9A-Za-z_-]{30,}'
verificar "Token / segredo atribuído"          '(User-Key|api[_-]?key|secret|token)"?[[:space:]]*[:=][[:space:]]*"[A-Za-z0-9_\-]{16,}'
verificar "ID de planilha Google real"         'spreadsheets/d/[A-Za-z0-9_-]{30,}'
verificar "FieldKey real do Ploomes"           'deal_[0-9A-F]*[1-9A-F][0-9A-F]*-[0-9A-F]{4}-'
verificar "E-mail fora do domínio de exemplo"  '[A-Za-z0-9._%+-]+@(gmail|hotmail|outlook|yahoo|icloud)\.'
verificar "Arquivo .env versionado"            '^N8N_SECRET=.+'

if [ "$falhas" -eq 0 ]; then echo "✓ Nenhum padrão sensível encontrado."; else exit 1; fi
