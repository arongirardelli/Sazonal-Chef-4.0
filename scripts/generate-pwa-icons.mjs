#!/usr/bin/env node

import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'
import path from 'path'

// Configurações dos ícones
const iconSizes = [
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' }
]

// Cores do tema Sazonal Chef
const colors = {
  primary: '#8B4513',    // Marrom
  secondary: '#D2691E',  // Chocolate
  accent: '#F5F0E5',     // Bege claro
  text: '#2F1B14'        // Marrom escuro
}

async function generateIcon(size, filename) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Fundo com gradiente
  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  )
  gradient.addColorStop(0, colors.secondary)
  gradient.addColorStop(1, colors.primary)
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  // Borda arredondada
  ctx.globalCompositeOperation = 'destination-in'
  ctx.beginPath()
  ctx.roundRect(0, 0, size, size, size * 0.2)
  ctx.fill()
  ctx.globalCompositeOperation = 'source-over'

  // Ícone de panela/chef
  ctx.fillStyle = colors.accent
  ctx.strokeStyle = colors.text
  ctx.lineWidth = size * 0.02

  // Desenhar panela
  const panWidth = size * 0.6
  const panHeight = size * 0.4
  const panX = (size - panWidth) / 2
  const panY = size * 0.3

  // Corpo da panela
  ctx.beginPath()
  ctx.roundRect(panX, panY, panWidth, panHeight, size * 0.05)
  ctx.fill()
  ctx.stroke()

  // Alça da panela
  const handleWidth = size * 0.15
  const handleHeight = size * 0.08
  ctx.beginPath()
  ctx.roundRect(panX - handleWidth, panY + panHeight * 0.3, handleWidth, handleHeight, size * 0.02)
  ctx.fill()
  ctx.stroke()

  // Vapor
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = size * 0.03
  ctx.lineCap = 'round'
  
  for (let i = 0; i < 3; i++) {
    const x = panX + panWidth * 0.2 + (i * panWidth * 0.3)
    const y = panY - size * 0.1
    
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.quadraticCurveTo(x + size * 0.02, y - size * 0.05, x, y - size * 0.1)
    ctx.stroke()
  }

  // Salvar arquivo
  const buffer = canvas.toBuffer('image/png')
  const outputPath = path.join(process.cwd(), 'public', 'icons', filename)
  fs.writeFileSync(outputPath, buffer)
  
  console.log(`✅ Gerado: ${filename} (${size}x${size})`)
}

async function generateMaskableIcon(size, filename) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Fundo sólido para ícones maskable
  ctx.fillStyle = colors.primary
  ctx.fillRect(0, 0, size, size)

  // Área segura (80% do centro)
  const safeArea = size * 0.8
  const safeX = (size - safeArea) / 2
  const safeY = (size - safeArea) / 2

  // Ícone centralizado na área segura
  ctx.fillStyle = colors.accent
  ctx.strokeStyle = colors.text
  ctx.lineWidth = size * 0.02

  // Desenhar panela na área segura
  const panWidth = safeArea * 0.6
  const panHeight = safeArea * 0.4
  const panX = safeX + (safeArea - panWidth) / 2
  const panY = safeY + safeArea * 0.2

  // Corpo da panela
  ctx.beginPath()
  ctx.roundRect(panX, panY, panWidth, panHeight, size * 0.05)
  ctx.fill()
  ctx.stroke()

  // Alça da panela
  const handleWidth = safeArea * 0.15
  const handleHeight = safeArea * 0.08
  ctx.beginPath()
  ctx.roundRect(panX - handleWidth, panY + panHeight * 0.3, handleWidth, handleHeight, size * 0.02)
  ctx.fill()
  ctx.stroke()

  // Vapor
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = size * 0.03
  ctx.lineCap = 'round'
  
  for (let i = 0; i < 3; i++) {
    const x = panX + panWidth * 0.2 + (i * panWidth * 0.3)
    const y = panY - safeArea * 0.1
    
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.quadraticCurveTo(x + size * 0.02, y - size * 0.05, x, y - size * 0.1)
    ctx.stroke()
  }

  // Salvar arquivo
  const buffer = canvas.toBuffer('image/png')
  const outputPath = path.join(process.cwd(), 'public', 'icons', filename)
  fs.writeFileSync(outputPath, buffer)
  
  console.log(`✅ Gerado: ${filename} (${size}x${size} maskable)`)
}

async function generateShortcutIcons() {
  const shortcutIcons = [
    { name: 'shortcut-recipes.png', emoji: '🍽️' },
    { name: 'shortcut-shopping.png', emoji: '🛒' },
    { name: 'shortcut-saved.png', emoji: '❤️' },
    { name: 'shortcut-profile.png', emoji: '👤' }
  ]

  for (const icon of shortcutIcons) {
    const canvas = createCanvas(96, 96)
    const ctx = canvas.getContext('2d')

    // Fundo
    ctx.fillStyle = colors.primary
    ctx.fillRect(0, 0, 96, 96)

    // Borda arredondada
    ctx.globalCompositeOperation = 'destination-in'
    ctx.beginPath()
    ctx.roundRect(0, 0, 96, 96, 20)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'

    // Emoji centralizado
    ctx.font = '48px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = colors.accent
    ctx.fillText(icon.emoji, 48, 48)

    // Salvar arquivo
    const buffer = canvas.toBuffer('image/png')
    const outputPath = path.join(process.cwd(), 'public', 'icons', icon.name)
    fs.writeFileSync(outputPath, buffer)
    
    console.log(`✅ Gerado: ${icon.name}`)
  }
}

async function generateFavicons() {
  const faviconSizes = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' }
  ]

  for (const favicon of faviconSizes) {
    const canvas = createCanvas(favicon.size, favicon.size)
    const ctx = canvas.getContext('2d')

    // Fundo
    ctx.fillStyle = colors.primary
    ctx.fillRect(0, 0, favicon.size, favicon.size)

    // Ícone simples
    ctx.fillStyle = colors.accent
    const iconSize = favicon.size * 0.6
    const iconX = (favicon.size - iconSize) / 2
    const iconY = (favicon.size - iconSize) / 2
    
    ctx.fillRect(iconX, iconY, iconSize, iconSize * 0.6)

    // Salvar arquivo
    const buffer = canvas.toBuffer('image/png')
    const outputPath = path.join(process.cwd(), 'public', 'icons', favicon.name)
    fs.writeFileSync(outputPath, buffer)
    
    console.log(`✅ Gerado: ${favicon.name}`)
  }

  // Apple Touch Icon
  const appleCanvas = createCanvas(180, 180)
  const appleCtx = appleCanvas.getContext('2d')

  // Fundo
  appleCtx.fillStyle = colors.primary
  appleCtx.fillRect(0, 0, 180, 180)

  // Borda arredondada
  appleCtx.globalCompositeOperation = 'destination-in'
  appleCtx.beginPath()
  appleCtx.roundRect(0, 0, 180, 180, 40)
  appleCtx.fill()
  appleCtx.globalCompositeOperation = 'source-over'

  // Ícone
  appleCtx.fillStyle = colors.accent
  const appleIconSize = 120
  const appleIconX = (180 - appleIconSize) / 2
  const appleIconY = (180 - appleIconSize) / 2
  
  appleCtx.fillRect(appleIconX, appleIconY, appleIconSize, appleIconSize * 0.6)

  // Salvar arquivo
  const appleBuffer = appleCanvas.toBuffer('image/png')
  const appleOutputPath = path.join(process.cwd(), 'public', 'icons', 'apple-touch-icon.png')
  fs.writeFileSync(appleOutputPath, appleBuffer)
  
  console.log(`✅ Gerado: apple-touch-icon.png`)
}

async function main() {
  console.log('🎨 Gerando ícones PWA para Sazonal Chef...\n')

  try {
    // Gerar ícones normais
    console.log('📱 Gerando ícones principais...')
    for (const icon of iconSizes) {
      await generateIcon(icon.size, icon.name)
    }

    // Gerar ícones maskable
    console.log('\n🎭 Gerando ícones maskable...')
    for (const icon of iconSizes) {
      const maskableName = icon.name.replace('.png', '-maskable.png')
      await generateMaskableIcon(icon.size, maskableName)
    }

    // Gerar ícones de atalho
    console.log('\n⚡ Gerando ícones de atalho...')
    await generateShortcutIcons()

    // Gerar favicons
    console.log('\n🌐 Gerando favicons...')
    await generateFavicons()

    console.log('\n✨ Todos os ícones PWA foram gerados com sucesso!')
    console.log('📁 Localização: public/icons/')
    
  } catch (error) {
    console.error('❌ Erro ao gerar ícones:', error)
    process.exit(1)
  }
}

main()
