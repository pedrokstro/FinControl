const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const projectRoot = path.resolve(__dirname, '..')
const iconsDir = path.join(projectRoot, 'public', 'icons')
const baseSvgPath = path.join(projectRoot, 'public', 'logo-icon-white.svg')

const baseIconSizes = [72, 96, 128, 144, 152, 192, 384, 512]

const shortcutSvgs = {
  'shortcut-new': {
    label: 'Nova',
    svg: (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-new" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0EA5E9" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="100" height="100" rx="24" fill="url(#grad-new)" />
  <line x1="50" y1="28" x2="50" y2="72" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" />
  <line x1="28" y1="50" x2="72" y2="50" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" />
</svg>`
  },
  'shortcut-transactions': {
    label: 'Transações',
    svg: (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-trans" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22C55E" />
      <stop offset="100%" stop-color="#16A34A" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="100" height="100" rx="24" fill="url(#grad-trans)" />
  <path d="M30 40 L50 25 L70 40" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M30 60 L50 75 L70 60" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
  <line x1="50" y1="32" x2="50" y2="68" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" />
</svg>`
  },
  'shortcut-reports': {
    label: 'Relatórios',
    svg: (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-reports" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F97316" />
      <stop offset="100%" stop-color="#C2410C" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="100" height="100" rx="24" fill="url(#grad-reports)" />
  <rect x="28" y="50" width="10" height="20" rx="3" fill="#FFFFFF" />
  <rect x="45" y="40" width="10" height="30" rx="3" fill="#FFFFFF" />
  <rect x="62" y="30" width="10" height="40" rx="3" fill="#FFFFFF" />
  <polyline points="25,60 40,45 55,55 75,30" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
</svg>`
  }
}

async function ensureIconsDir() {
  await fs.promises.mkdir(iconsDir, { recursive: true })
}

async function generateBaseIcons() {
  const svgBuffer = await fs.promises.readFile(baseSvgPath)

  const tasks = baseIconSizes.map(async (size) => {
    const filePath = path.join(iconsDir, `icon-${size}x${size}.png`)
    await sharp(svgBuffer, { density: size * 4 })
      .resize(size, size)
      .png({ quality: 100 })
      .toFile(filePath)
    console.log(`✅ icon-${size}x${size}.png gerado`)
  })

  await Promise.all(tasks)
}

async function generateShortcutIcons() {
  const size = 96

  const tasks = Object.entries(shortcutSvgs).map(async ([name, config]) => {
    const svgString = config.svg(size)
    const filePath = path.join(iconsDir, `${name}.png`)

    await sharp(Buffer.from(svgString))
      .resize(size, size)
      .png({ quality: 100 })
      .toFile(filePath)

    console.log(`✅ ${name}.png gerado`)
  })

  await Promise.all(tasks)
}

async function main() {
  try {
    await ensureIconsDir()
    await generateBaseIcons()
    await generateShortcutIcons()
    console.log('\n🎉 Todos os ícones PWA foram gerados em /public/icons')
  } catch (error) {
    console.error('❌ Erro ao gerar ícones PWA:', error)
    process.exit(1)
  }
}

main()
