#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('🚀 Iniciando build PWA do Sazonal Chef...\n')

try {
  // 1. Limpar build anterior
  console.log('🧹 Limpando build anterior...')
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true })
  }

  // 2. Gerar ícones PWA
  console.log('🎨 Gerando ícones PWA...')
  execSync('node scripts/generate-pwa-icons.mjs', { stdio: 'inherit' })

  // 3. Build do Vite
  console.log('📦 Executando build do Vite...')
  execSync('npm run build', { stdio: 'inherit' })

  // 4. Verificar arquivos essenciais
  console.log('✅ Verificando arquivos essenciais...')
  const essentialFiles = [
    'dist/index.html',
    'dist/manifest.json',
    'dist/sw.js',
    'dist/icons/icon-192x192.png',
    'dist/icons/icon-512x512.png'
  ]

  for (const file of essentialFiles) {
    if (!fs.existsSync(file)) {
      throw new Error(`Arquivo essencial não encontrado: ${file}`)
    }
  }

  // 5. Otimizar Service Worker
  console.log('⚙️ Otimizando Service Worker...')
  const swPath = 'dist/sw.js'
  let swContent = fs.readFileSync(swPath, 'utf8')
  
  // Adicionar timestamp de build
  const buildTime = new Date().toISOString()
  swContent = swContent.replace(
    'const CACHE_NAME = \'sazonal-chef-v1.0.0\'',
    `const CACHE_NAME = 'sazonal-chef-v1.0.0-${Date.now()}'`
  )
  
  // Adicionar comentário de build
  swContent = `// Build: ${buildTime}\n// PWA Version: 1.0.0\n${swContent}`
  
  fs.writeFileSync(swPath, swContent)

  // 6. Otimizar manifest.json
  console.log('📱 Otimizando manifest.json...')
  const manifestPath = 'dist/manifest.json'
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  
  // Adicionar timestamp
  manifest.build_time = buildTime
  manifest.version = '1.0.0'
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

  // 7. Gerar sitemap
  console.log('🗺️ Gerando sitemap...')
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sazonalchef.app/</loc>
    <lastmod>${buildTime}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://sazonalchef.app/recipes</loc>
    <lastmod>${buildTime}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sazonalchef.app/shopping-list</loc>
    <lastmod>${buildTime}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`
  
  fs.writeFileSync('dist/sitemap.xml', sitemap)

  // 8. Gerar relatório de build
  console.log('📊 Gerando relatório de build...')
  const buildReport = {
    timestamp: buildTime,
    version: '1.0.0',
    files: {
      total: 0,
      size: 0
    },
    pwa: {
      manifest: fs.existsSync('dist/manifest.json'),
      serviceWorker: fs.existsSync('dist/sw.js'),
      icons: fs.readdirSync('dist/icons').length
    }
  }

  // Contar arquivos e tamanho
  const countFiles = (dir) => {
    let count = 0
    let size = 0
    
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        const subCount = countFiles(filePath)
        count += subCount.count
        size += subCount.size
      } else {
        count++
        size += stat.size
      }
    }
    
    return { count, size }
  }

  const fileStats = countFiles('dist')
  buildReport.files = fileStats

  fs.writeFileSync('dist/build-report.json', JSON.stringify(buildReport, null, 2))

  // 9. Verificar PWA
  console.log('🔍 Verificando PWA...')
  const pwaChecks = [
    { name: 'Manifest', check: () => fs.existsSync('dist/manifest.json') },
    { name: 'Service Worker', check: () => fs.existsSync('dist/sw.js') },
    { name: 'Ícones PWA', check: () => fs.readdirSync('dist/icons').length >= 8 },
    { name: 'HTTPS Ready', check: () => fs.existsSync('dist/.htaccess') },
    { name: 'Robots.txt', check: () => fs.existsSync('dist/robots.txt') }
  ]

  const pwaResults = pwaChecks.map(check => ({
    name: check.name,
    passed: check.check()
  }))

  const allPassed = pwaResults.every(result => result.passed)
  
  console.log('\n📋 Relatório PWA:')
  pwaResults.forEach(result => {
    const status = result.passed ? '✅' : '❌'
    console.log(`  ${status} ${result.name}`)
  })

  if (allPassed) {
    console.log('\n🎉 Build PWA concluído com sucesso!')
    console.log(`📁 Arquivos gerados: ${buildReport.files.total}`)
    console.log(`📦 Tamanho total: ${(buildReport.files.size / 1024 / 1024).toFixed(2)} MB`)
    console.log(`⏰ Build time: ${buildTime}`)
    console.log('\n🚀 Pronto para deploy!')
  } else {
    console.log('\n⚠️ Build concluído com avisos. Verifique os itens acima.')
  }

} catch (error) {
  console.error('❌ Erro no build PWA:', error.message)
  process.exit(1)
}
