use image::{DynamicImage, ImageFormat};
use std::io::Cursor;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn init() {
    console_error_panic_hook::set_once();
}

/// 画像を処理する（デコード → リサイズ → エンコード）
///
/// # 引数
/// - `input_bytes`: 入力画像のバイト列（PNG/JPEG/WebP 等）
/// - `target_width`: 出力幅（0 = 変更なし）
/// - `target_height`: 出力高さ（0 = 変更なし）
/// - `keep_aspect_ratio`: アスペクト比を維持するか
/// - `format`: 出力フォーマット ("png" | "jpeg")
/// - `quality`: JPEG クオリティ（1〜100）
///
/// # 戻り値
/// エンコード済みバイト列（JS 側では `Uint8Array` として受け取る）
#[wasm_bindgen]
pub fn process_image(
    input_bytes: &[u8],
    target_width: u32,
    target_height: u32,
    keep_aspect_ratio: bool,
    format: &str,
    quality: u8,
) -> Result<Vec<u8>, JsValue> {
    let img = image::load_from_memory(input_bytes)
        .map_err(|e| JsValue::from_str(&format!("デコードエラー: {e}")))?;

    let img = if target_width > 0 || target_height > 0 {
        resize_image(img, target_width, target_height, keep_aspect_ratio)
    } else {
        img
    };

    let mut output: Vec<u8> = Vec::new();

    match format {
        "jpeg" | "jpg" => {
            let quality = quality.clamp(1, 100);
            let mut cursor = Cursor::new(&mut output);
            let encoder =
                image::codecs::jpeg::JpegEncoder::new_with_quality(&mut cursor, quality);
            img.write_with_encoder(encoder)
                .map_err(|e| JsValue::from_str(&format!("JPEG エンコードエラー: {e}")))?;
        }
        _ => {
            // "png" またはそれ以外はすべて PNG として出力
            let mut cursor = Cursor::new(&mut output);
            img.write_to(&mut cursor, ImageFormat::Png)
                .map_err(|e| JsValue::from_str(&format!("PNG エンコードエラー: {e}")))?;
        }
    }

    Ok(output)
}

fn resize_image(
    img: DynamicImage,
    target_w: u32,
    target_h: u32,
    keep_aspect: bool,
) -> DynamicImage {
    let (orig_w, orig_h) = (img.width(), img.height());
    let (new_w, new_h) = if keep_aspect {
        fit_dimensions(orig_w, orig_h, target_w, target_h)
    } else {
        let w = if target_w == 0 { orig_w } else { target_w };
        let h = if target_h == 0 { orig_h } else { target_h };
        (w, h)
    };
    img.resize_exact(new_w, new_h, image::imageops::FilterType::Lanczos3)
}

/// アスペクト比を維持しつつ target に収まるサイズを計算する
fn fit_dimensions(orig_w: u32, orig_h: u32, target_w: u32, target_h: u32) -> (u32, u32) {
    match (target_w, target_h) {
        (0, 0) => (orig_w, orig_h),
        (w, 0) => {
            let h = (orig_h as f64 * w as f64 / orig_w as f64).round() as u32;
            (w, h.max(1))
        }
        (0, h) => {
            let w = (orig_w as f64 * h as f64 / orig_h as f64).round() as u32;
            (w.max(1), h)
        }
        (w, h) => {
            let ratio = (w as f64 / orig_w as f64).min(h as f64 / orig_h as f64);
            let nw = (orig_w as f64 * ratio).round() as u32;
            let nh = (orig_h as f64 * ratio).round() as u32;
            (nw.max(1), nh.max(1))
        }
    }
}
