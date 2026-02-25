import init, { process_image } from './pkg/czimg.js'

// ===== 状態管理 =====
let wasmReady = false
let currentFile: File | null = null
let convertedObjectUrl: string | null = null
let originalObjectUrl: string | null = null

// ===== DOM 要素取得 =====
const dropZone = document.getElementById('dropZone') as HTMLDivElement
const fileInput = document.getElementById('fileInput') as HTMLInputElement
const loadingMsg = document.getElementById('loadingMsg') as HTMLParagraphElement
const settingsSection = document.getElementById('settingsSection') as HTMLElement
const resultsSection = document.getElementById('resultsSection') as HTMLElement

const formatSelect = document.getElementById('format') as HTMLSelectElement
const qualityInput = document.getElementById('quality') as HTMLInputElement
const qualityValue = document.getElementById('qualityValue') as HTMLElement
const qualityField = document.getElementById('qualityField') as HTMLDivElement
const targetWidthInput = document.getElementById('targetWidth') as HTMLInputElement
const targetHeightInput = document.getElementById('targetHeight') as HTMLInputElement
const keepAspectCheckbox = document.getElementById('keepAspect') as HTMLInputElement
const processBtn = document.getElementById('processBtn') as HTMLButtonElement

const originalPreview = document.getElementById('originalPreview') as HTMLImageElement
const convertedPreview = document.getElementById('convertedPreview') as HTMLImageElement
const originalMeta = document.getElementById('originalMeta') as HTMLParagraphElement
const convertedMeta = document.getElementById('convertedMeta') as HTMLParagraphElement
const statsEl = document.getElementById('stats') as HTMLDivElement
const downloadBtn = document.getElementById('downloadBtn') as HTMLAnchorElement
const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement

// ===== WASM 初期化 =====
async function main() {
  loadingMsg.hidden = false
  try {
    await init()
    wasmReady = true
  } finally {
    loadingMsg.hidden = true
  }
  setupUI()
}

// ===== UI セットアップ =====
function setupUI() {
  // ドラッグ & ドロップ
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault()
    dropZone.classList.add('is-dragging')
  })
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('is-dragging'))
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault()
    dropZone.classList.remove('is-dragging')
    const file = e.dataTransfer?.files[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  })

  // キーボード操作
  dropZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') fileInput.click()
  })

  // ファイル選択
  fileInput.addEventListener('change', () => {
    if (fileInput.files?.[0]) handleFile(fileInput.files[0])
  })

  // クオリティスライダー
  qualityInput.addEventListener('input', () => {
    qualityValue.textContent = qualityInput.value
  })

  // フォーマット変更時の表示切替
  formatSelect.addEventListener('change', updateQualityVisibility)

  // 変換ボタン
  processBtn.addEventListener('click', processImage)

  // リセットボタン
  resetBtn.addEventListener('click', resetUI)
}

function updateQualityVisibility() {
  qualityField.style.display = formatSelect.value === 'png' ? 'none' : ''
}

// ===== ファイル読み込み =====
async function handleFile(file: File) {
  currentFile = file

  // 前回の URL を解放
  if (originalObjectUrl) URL.revokeObjectURL(originalObjectUrl)
  if (convertedObjectUrl) URL.revokeObjectURL(convertedObjectUrl)

  originalObjectUrl = URL.createObjectURL(file)
  originalPreview.src = originalObjectUrl

  // 元画像のサイズ取得（width/height）
  await new Promise<void>((resolve) => {
    originalPreview.onload = () => resolve()
  })

  originalMeta.textContent =
    `${originalPreview.naturalWidth} × ${originalPreview.naturalHeight} px  |  ${formatSize(file.size)}`

  settingsSection.hidden = false
  resultsSection.hidden = true
}

// ===== 画像変換 =====
async function processImage() {
  if (!currentFile || !wasmReady) return

  const format = formatSelect.value
  const quality = parseInt(qualityInput.value, 10)
  const targetWidth = parseInt(targetWidthInput.value, 10) || 0
  const targetHeight = parseInt(targetHeightInput.value, 10) || 0
  const keepAspect = keepAspectCheckbox.checked

  processBtn.disabled = true
  processBtn.textContent = '処理中...'

  try {
    const inputBytes = new Uint8Array(await currentFile.arrayBuffer())

    let resultBlob: Blob
    let mimeType: string

    if (format === 'webp') {
      // WebP: Rust で PNG としてリサイズ → JS の canvas で WebP に変換
      const pngBytes = process_image(inputBytes, targetWidth, targetHeight, keepAspect, 'png', 100)
      resultBlob = await encodeWebP(pngBytes, quality)
      mimeType = 'image/webp'
    } else {
      const resultBytes = process_image(inputBytes, targetWidth, targetHeight, keepAspect, format, quality)
      mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png'
      resultBlob = new Blob([resultBytes], { type: mimeType })
    }

    // 前回の変換結果 URL を解放
    if (convertedObjectUrl) URL.revokeObjectURL(convertedObjectUrl)
    convertedObjectUrl = URL.createObjectURL(resultBlob)

    // プレビュー更新
    convertedPreview.src = convertedObjectUrl
    await new Promise<void>((resolve) => { convertedPreview.onload = () => resolve() })

    convertedMeta.textContent =
      `${convertedPreview.naturalWidth} × ${convertedPreview.naturalHeight} px  |  ${formatSize(resultBlob.size)}`

    // 圧縮率
    const diff = currentFile.size - resultBlob.size
    const ratio = Math.abs(diff / currentFile.size * 100).toFixed(1)
    if (diff > 0) {
      statsEl.innerHTML = `<span class="saved">▼ ${ratio}% 削減</span>（${formatSize(currentFile.size)} → ${formatSize(resultBlob.size)}）`
    } else if (diff < 0) {
      statsEl.innerHTML = `<span class="increased">▲ ${ratio}% 増加</span>（${formatSize(currentFile.size)} → ${formatSize(resultBlob.size)}）`
    } else {
      statsEl.textContent = `変化なし（${formatSize(resultBlob.size)}）`
    }

    // ダウンロードリンク
    const ext = format === 'jpeg' ? 'jpg' : format
    const baseName = currentFile.name.replace(/\.[^.]+$/, '')
    downloadBtn.href = convertedObjectUrl
    downloadBtn.download = `${baseName}_czimg.${ext}`

    resultsSection.hidden = false
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  } catch (err) {
    alert(`変換エラー: ${err}`)
  } finally {
    processBtn.disabled = false
    processBtn.textContent = '変換する'
  }
}

// ===== WebP エンコード（Canvas 経由）=====
function encodeWebP(pngBytes: Uint8Array, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const pngBlob = new Blob([pngBytes], { type: 'image/png' })
    const pngUrl = URL.createObjectURL(pngBlob)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(pngUrl)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('このブラウザは WebP エンコードをサポートしていません'))
          }
        },
        'image/webp',
        quality / 100
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(pngUrl)
      reject(new Error('画像の読み込みに失敗しました'))
    }

    img.src = pngUrl
  })
}

// ===== UI リセット =====
function resetUI() {
  currentFile = null
  if (originalObjectUrl) { URL.revokeObjectURL(originalObjectUrl); originalObjectUrl = null }
  if (convertedObjectUrl) { URL.revokeObjectURL(convertedObjectUrl); convertedObjectUrl = null }

  originalPreview.src = ''
  convertedPreview.src = ''
  fileInput.value = ''
  targetWidthInput.value = ''
  targetHeightInput.value = ''

  settingsSection.hidden = true
  resultsSection.hidden = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ===== ユーティリティ =====
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

main().catch(console.error)
