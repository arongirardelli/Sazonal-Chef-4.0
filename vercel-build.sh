#!/bin/bash

# Script de build para Vercel
echo "🔧 Configurando build para Vercel..."

# Remover node_modules e package-lock.json se existirem
if [ -d "node_modules" ]; then
    echo "🗑️ Removendo node_modules..."
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    echo "🗑️ Removendo package-lock.json..."
    rm -f package-lock.json
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install --legacy-peer-deps

# Build do projeto
echo "🏗️ Executando build..."
npm run build

echo "✅ Build concluído com sucesso!"
