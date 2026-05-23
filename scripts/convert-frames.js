const fs = require('fs/promises')
const path = require('path')
const sharp = require('sharp')

const projectRoot = path.resolve(__dirname, '..')
const publicRoot = path.resolve(projectRoot, 'public')
const sourceDir = safeJoin(publicRoot, 'CamFrames')
const outputSets = [
  { name: 'desktop', width: 1920, quality: 76 },
  { name: 'tablet', width: 1280, quality: 74 },
  { name: 'mobile', width: 960, quality: 70 },
]
const concurrency = Math.max(1, Math.min(4, Number(process.env.FRAME_CONCURRENCY) || 4))

function safeJoin(baseDir, ...segments) {
  const basePath = path.resolve(baseDir)
  const targetPath = path.resolve(basePath, ...segments)
  const relativePath = path.relative(basePath, targetPath)

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new Error(`Refusing to access path outside ${basePath}: ${targetPath}`)
  }

  return targetPath
}

async function fileExists(filePath) {
  const safePath = safeJoin(publicRoot, path.relative(publicRoot, filePath))

  try {
    await fs.access(safePath)
    return true
  } catch {
    return false
  }
}

async function runPool(items, worker) {
  let cursor = 0

  async function next() {
    const current = cursor++

    if (current >= items.length) return

    await worker(items[current], current)
    await next()
  }

  await Promise.all(Array.from({ length: concurrency }, next))
}

async function convertFrames() {
  const files = (await fs.readdir(sourceDir))
    .filter(file => file.toLowerCase().endsWith('.png'))
    .sort()

  if (!files.length) {
    throw new Error(`No PNG frames found in ${sourceDir}`)
  }

  for (const set of outputSets) {
    const outputDir = safeJoin(publicRoot, 'CamFramesWebP', set.name)
    await fs.mkdir(outputDir, { recursive: true })

    console.log(`Converting ${files.length} frames for ${set.name} (${set.width}px, q${set.quality})`)

    let converted = 0
    let skipped = 0

    await runPool(files, async (file, index) => {
      const inputPath = safeJoin(sourceDir, file)
      const outputPath = safeJoin(outputDir, `frame_${String(index).padStart(3, '0')}.webp`)

      if (await fileExists(outputPath)) {
        skipped++
        return
      }

      await sharp(inputPath)
        .resize({ width: set.width, withoutEnlargement: true })
        .webp({ quality: set.quality, effort: 5 })
        .toFile(outputPath)

      converted++
    })

    console.log(`Finished ${set.name}: ${converted} converted, ${skipped} skipped`)
  }
}

convertFrames().catch(error => {
  console.error(error)
  process.exit(1)
})
