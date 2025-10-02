#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

console.log('🔍 Auditoria PWA do Sazonal Chef\n')

const auditResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  checks: []
}

function addCheck(name, passed, message, isWarning = false) {
  auditResults.checks.push({ name, passed, message, isWarning })
  if (passed) {
    auditResults.passed++
  } else if (isWarning) {
    auditResults.warnings++
  } else {
    auditResults.failed++
  }
}

// Verificar arquivos essenciais
console.log('📁 Verificando arquivos essenciais...')

const essentialFiles = [
  { path: 'public/manifest.json', required: true },
  { path: 'public/sw.js', required: true },
  { path: 'index.html', required: true },
  { path: 'public/.htaccess', required: false },
  { path: 'public/robots.txt', required: false },
  { path: 'public/browserconfig.xml', required: false }
]

essentialFiles.forEach(file => {
  const exists = fs.existsSync(file.path)
  addCheck(
    `Arquivo ${file.path}`,
    exists || !file.required,
    exists ? 'Encontrado' : file.required ? 'Arquivo obrigatório não encontrado' : 'Arquivo opcional não encontrado',
    !file.required && !exists
  )
})

// Verificar ícones PWA
console.log('🎨 Verificando ícones PWA...')

const requiredIcons = [
  'icon-72x72.png',
  'icon-96x96.png',
  'icon-128x128.png',
  'icon-144x144.png',
  'icon-152x152.png',
  'icon-192x192.png',
  'icon-384x384.png',
  'icon-512x512.png'
]

const iconsDir = 'public/icons'
const iconsExist = fs.existsSync(iconsDir)

addCheck(
  'Diretório de ícones',
  iconsExist,
  iconsExist ? 'Diretório encontrado' : 'Diretório de ícones não encontrado'
)

if (iconsExist) {
  const existingIcons = fs.readdirSync(iconsDir)
  
  requiredIcons.forEach(icon => {
    const exists = existingIcons.includes(icon)
    addCheck(
      `Ícone ${icon}`,
      exists,
      exists ? 'Encontrado' : 'Ícone obrigatório não encontrado'
    )
  })

  // Verificar ícones maskable
  const maskableIcons = existingIcons.filter(icon => icon.includes('maskable'))
  addCheck(
    'Ícones maskable',
    maskableIcons.length > 0,
    maskableIcons.length > 0 ? `${maskableIcons.length} ícones maskable encontrados` : 'Nenhum ícone maskable encontrado',
    true
  )
}

// Verificar manifest.json
console.log('📱 Verificando manifest.json...')

if (fs.existsSync('public/manifest.json')) {
  try {
    const manifest = JSON.parse(fs.readFileSync('public/manifest.json', 'utf8'))
    
    const manifestChecks = [
      { key: 'name', required: true },
      { key: 'short_name', required: true },
      { key: 'start_url', required: true },
      { key: 'display', required: true },
      { key: 'background_color', required: true },
      { key: 'theme_color', required: true },
      { key: 'icons', required: true },
      { key: 'orientation', required: false },
      { key: 'scope', required: false },
      { key: 'lang', required: false }
    ]

    manifestChecks.forEach(check => {
      const exists = manifest.hasOwnProperty(check.key)
      addCheck(
        `Manifest ${check.key}`,
        exists || !check.required,
        exists ? `Valor: ${JSON.stringify(manifest[check.key])}` : check.required ? 'Campo obrigatório ausente' : 'Campo opcional ausente',
        !check.required && !exists
      )
    })

    // Verificar ícones no manifest
    if (manifest.icons && Array.isArray(manifest.icons)) {
      addCheck(
        'Ícones no manifest',
        manifest.icons.length > 0,
        `${manifest.icons.length} ícones definidos no manifest`
      )

      // Verificar tamanhos de ícones
      const iconSizes = manifest.icons.map(icon => icon.sizes).filter(Boolean)
      const requiredSizes = ['192x192', '512x512']
      const hasRequiredSizes = requiredSizes.every(size => 
        iconSizes.some(iconSize => iconSize.includes(size))
      )
      
      addCheck(
        'Tamanhos de ícones obrigatórios',
        hasRequiredSizes,
        hasRequiredSizes ? 'Tamanhos 192x192 e 512x512 encontrados' : 'Tamanhos obrigatórios ausentes'
      )
    }

  } catch (error) {
    addCheck(
      'Manifest JSON válido',
      false,
      `Erro ao parsear manifest.json: ${error.message}`
    )
  }
}

// Verificar Service Worker
console.log('⚙️ Verificando Service Worker...')

if (fs.existsSync('public/sw.js')) {
  const swContent = fs.readFileSync('public/sw.js', 'utf8')
  
  const swChecks = [
    { name: 'Event listener install', pattern: /addEventListener\s*\(\s*['"]install['"]/ },
    { name: 'Event listener activate', pattern: /addEventListener\s*\(\s*['"]activate['"]/ },
    { name: 'Event listener fetch', pattern: /addEventListener\s*\(\s*['"]fetch['"]/ },
    { name: 'Cache strategy', pattern: /cache|Cache/ },
    { name: 'Push notifications', pattern: /addEventListener\s*\(\s*['"]push['"]/ },
    { name: 'Notification click', pattern: /addEventListener\s*\(\s*['"]notificationclick['"]/ }
  ]

  swChecks.forEach(check => {
    const found = check.pattern.test(swContent)
    addCheck(
      `SW ${check.name}`,
      found,
      found ? 'Implementado' : 'Não implementado'
    )
  })
}

// Verificar HTML
console.log('🌐 Verificando HTML...')

if (fs.existsSync('index.html')) {
  const htmlContent = fs.readFileSync('index.html', 'utf8')
  
  const htmlChecks = [
    { name: 'Meta viewport', pattern: /<meta[^>]*name=['"]viewport['"]/ },
    { name: 'Meta theme-color', pattern: /<meta[^>]*name=['"]theme-color['"]/ },
    { name: 'Manifest link', pattern: /<link[^>]*rel=['"]manifest['"]/ },
    { name: 'Apple touch icon', pattern: /<link[^>]*rel=['"]apple-touch-icon['"]/ },
    { name: 'Favicon', pattern: /<link[^>]*rel=['"]icon['"]/ },
    { name: 'Service Worker registration', pattern: /serviceWorker\.register/ }
  ]

  htmlChecks.forEach(check => {
    const found = check.pattern.test(htmlContent)
    addCheck(
      `HTML ${check.name}`,
      found,
      found ? 'Encontrado' : 'Não encontrado'
    )
  })
}

// Verificar configurações do Vite
console.log('⚡ Verificando configurações do Vite...')

if (fs.existsSync('vite.config.ts')) {
  const viteContent = fs.readFileSync('vite.config.ts', 'utf8')
  
  const viteChecks = [
    { name: 'Build target ES2015', pattern: /target:\s*['"]es2015['"]/ },
    { name: 'Minificação', pattern: /minify/ },
    { name: 'Chunks manuais', pattern: /manualChunks/ }
  ]

  viteChecks.forEach(check => {
    const found = check.pattern.test(viteContent)
    addCheck(
      `Vite ${check.name}`,
      found,
      found ? 'Configurado' : 'Não configurado',
      true
    )
  })
}

// Verificar package.json
console.log('📦 Verificando package.json...')

if (fs.existsSync('package.json')) {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    
    addCheck(
      'Versão do package',
      packageJson.version && packageJson.version !== '0.0.0',
      packageJson.version ? `Versão: ${packageJson.version}` : 'Versão não definida'
    )

    addCheck(
      'Scripts PWA',
      packageJson.scripts && (packageJson.scripts['build:pwa'] || packageJson.scripts['build:prod']),
      packageJson.scripts && (packageJson.scripts['build:pwa'] || packageJson.scripts['build:prod']) ? 'Scripts PWA encontrados' : 'Scripts PWA não encontrados'
    )

  } catch (error) {
    addCheck(
      'Package.json válido',
      false,
      `Erro ao parsear package.json: ${error.message}`
    )
  }
}

// Relatório final
console.log('\n📊 Relatório da Auditoria PWA:')
console.log('=' .repeat(50))

auditResults.checks.forEach(check => {
  const status = check.passed ? '✅' : check.isWarning ? '⚠️' : '❌'
  console.log(`${status} ${check.name}: ${check.message}`)
})

console.log('\n' + '=' .repeat(50))
console.log(`✅ Passou: ${auditResults.passed}`)
console.log(`❌ Falhou: ${auditResults.failed}`)
console.log(`⚠️ Avisos: ${auditResults.warnings}`)

const totalChecks = auditResults.passed + auditResults.failed + auditResults.warnings
const successRate = ((auditResults.passed / totalChecks) * 100).toFixed(1)

console.log(`📈 Taxa de sucesso: ${successRate}%`)

if (auditResults.failed === 0) {
  console.log('\n🎉 PWA está pronto para produção!')
} else if (auditResults.failed <= 2) {
  console.log('\n⚠️ PWA quase pronto, mas precisa de alguns ajustes.')
} else {
  console.log('\n❌ PWA precisa de correções significativas antes do deploy.')
}

// Salvar relatório
const report = {
  timestamp: new Date().toISOString(),
  results: auditResults,
  successRate: parseFloat(successRate)
}

fs.writeFileSync('pwa-audit-report.json', JSON.stringify(report, null, 2))
console.log('\n📄 Relatório salvo em: pwa-audit-report.json')

process.exit(auditResults.failed > 0 ? 1 : 0)
