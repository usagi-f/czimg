# czimg — Browser Image Compressor & Converter

A client-side image compression and conversion tool built with Rust + WebAssembly.
All processing runs in the browser — no image data is ever sent to a server.

## Features

- **Format conversion** — convert to PNG, JPEG, or WebP
- **Quality control** — set JPEG / WebP quality from 1 to 100
- **Resize** — specify width and/or height, with optional aspect-ratio lock
- **Before / after preview** — compare the original and converted images side by side
- **Size comparison** — shows file sizes and the compression percentage
- **Download** — save the converted image locally

## Tech stack

| Layer | Technology |
|-------|------------|
| Image processing | Rust + WebAssembly (`image` crate) |
| Build toolchain | wasm-pack |
| Frontend | TypeScript + Vite |
| WebP encoding | Canvas API (browser-native) |
| Deployment | GitHub Pages / Cloudflare Pages |

> **Why Canvas for WebP?**
> The `image` crate's WebP encoder wraps `libwebp-sys` (C bindings) which does not
> compile to `wasm32-unknown-unknown`.  Instead, the Rust side resizes the image and
> returns PNG bytes; the JS side draws those onto a `<canvas>` and calls
> `canvas.toBlob('image/webp', quality)`.

## Prerequisites

- Rust (stable toolchain)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/)
- Node.js 18+

```bash
rustup target add wasm32-unknown-unknown
cargo install wasm-pack
```

## Development

```bash
# Build WASM + start the Vite dev server
npm run dev
```

## Production build

```bash
npm run build
# Output: web/dist/
```

## Project layout

```
czimg/
├── Cargo.toml               # Rust crate config
├── src/
│   └── lib.rs               # WASM public API (decode · resize · encode)
├── web/
│   ├── index.html           # UI markup
│   ├── style.css            # Styles
│   ├── main.ts              # TypeScript logic
│   ├── vite.config.ts       # Vite config
│   └── pkg/                 # wasm-pack output (gitignored)
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Pages auto-deploy
└── package.json             # Root build scripts
```

## License

MIT
