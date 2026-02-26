(function() {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const n of document.querySelectorAll('link[rel="modulepreload"]')) i(n);
  new MutationObserver((n) => {
    for (const s of n) if (s.type === "childList") for (const o of s.addedNodes) o.tagName === "LINK" && o.rel === "modulepreload" && i(o);
  }).observe(document, { childList: true, subtree: true });
  function r(n) {
    const s = {};
    return n.integrity && (s.integrity = n.integrity), n.referrerPolicy && (s.referrerPolicy = n.referrerPolicy), n.crossOrigin === "use-credentials" ? s.credentials = "include" : n.crossOrigin === "anonymous" ? s.credentials = "omit" : s.credentials = "same-origin", s;
  }
  function i(n) {
    if (n.ep) return;
    n.ep = true;
    const s = r(n);
    fetch(n.href, s);
  }
})();
function $(e, t, r, i, n, s) {
  const o = K(e, a.__wbindgen_malloc), c = _, l = P(n, a.__wbindgen_malloc, a.__wbindgen_realloc), g = _, f = a.process_image(o, c, t, r, i, l, g, s);
  if (f[3]) throw Z(f[2]);
  var O = N(f[0], f[1]).slice();
  return a.__wbindgen_free(f[0], f[1] * 1, 1), O;
}
function V() {
  return { __proto__: null, "./czimg_bg.js": { __proto__: null, __wbg_error_a6fa202b58aa1cd3: function(t, r) {
    let i, n;
    try {
      i = t, n = r, console.error(T(t, r));
    } finally {
      a.__wbindgen_free(i, n, 1);
    }
  }, __wbg_new_227d7c05414eb861: function() {
    return new Error();
  }, __wbg_stack_3b0d974bbf31e44f: function(t, r) {
    const i = r.stack, n = P(i, a.__wbindgen_malloc, a.__wbindgen_realloc), s = _;
    j().setInt32(t + 4, s, true), j().setInt32(t + 0, n, true);
  }, __wbindgen_cast_0000000000000001: function(t, r) {
    return T(t, r);
  }, __wbindgen_init_externref_table: function() {
    const t = a.__wbindgen_externrefs, r = t.grow(4);
    t.set(0, void 0), t.set(r + 0, void 0), t.set(r + 1, null), t.set(r + 2, true), t.set(r + 3, false);
  } } };
}
function N(e, t) {
  return e = e >>> 0, w().subarray(e / 1, e / 1 + t);
}
let y = null;
function j() {
  return (y === null || y.buffer.detached === true || y.buffer.detached === void 0 && y.buffer !== a.memory.buffer) && (y = new DataView(a.memory.buffer)), y;
}
function T(e, t) {
  return e = e >>> 0, Q(e, t);
}
let v = null;
function w() {
  return (v === null || v.byteLength === 0) && (v = new Uint8Array(a.memory.buffer)), v;
}
function K(e, t) {
  const r = t(e.length * 1, 1) >>> 0;
  return w().set(e, r / 1), _ = e.length, r;
}
function P(e, t, r) {
  if (r === void 0) {
    const c = R.encode(e), l = t(c.length, 1) >>> 0;
    return w().subarray(l, l + c.length).set(c), _ = c.length, l;
  }
  let i = e.length, n = t(i, 1) >>> 0;
  const s = w();
  let o = 0;
  for (; o < i; o++) {
    const c = e.charCodeAt(o);
    if (c > 127) break;
    s[n + o] = c;
  }
  if (o !== i) {
    o !== 0 && (e = e.slice(o)), n = r(n, i, i = o + e.length * 3, 1) >>> 0;
    const c = w().subarray(n + o, n + i), l = R.encodeInto(e, c);
    o += l.written, n = r(n, i, o, 1) >>> 0;
  }
  return _ = o, n;
}
function Z(e) {
  const t = a.__wbindgen_externrefs.get(e);
  return a.__externref_table_dealloc(e), t;
}
let U = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
U.decode();
const J = 2146435072;
let W = 0;
function Q(e, t) {
  return W += t, W >= J && (U = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }), U.decode(), W = t), U.decode(w().subarray(e, e + t));
}
const R = new TextEncoder();
"encodeInto" in R || (R.encodeInto = function(e, t) {
  const r = R.encode(e);
  return t.set(r), { read: e.length, written: r.length };
});
let _ = 0, a;
function X(e, t) {
  return a = e.exports, y = null, v = null, a.__wbindgen_start(), a;
}
async function Y(e, t) {
  if (typeof Response == "function" && e instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming == "function") try {
      return await WebAssembly.instantiateStreaming(e, t);
    } catch (n) {
      if (e.ok && r(e.type) && e.headers.get("Content-Type") !== "application/wasm") console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", n);
      else throw n;
    }
    const i = await e.arrayBuffer();
    return await WebAssembly.instantiate(i, t);
  } else {
    const i = await WebAssembly.instantiate(e, t);
    return i instanceof WebAssembly.Instance ? { instance: i, module: e } : i;
  }
  function r(i) {
    switch (i) {
      case "basic":
      case "cors":
      case "default":
        return true;
    }
    return false;
  }
}
async function G(e) {
  if (a !== void 0) return a;
  e !== void 0 && (Object.getPrototypeOf(e) === Object.prototype ? { module_or_path: e } = e : console.warn("using deprecated parameters for the initialization function; pass a single object instead")), e === void 0 && (e = new URL("" + new URL("czimg_bg-Chdv_t9J.wasm", import.meta.url).href, import.meta.url));
  const t = V();
  (typeof e == "string" || typeof Request == "function" && e instanceof Request || typeof URL == "function" && e instanceof URL) && (e = fetch(e));
  const { instance: r, module: i } = await Y(await e, t);
  return X(r);
}
let S = false, u = null, d = null, p = null;
const m = document.getElementById("dropZone"), E = document.getElementById("fileInput"), z = document.getElementById("loadingMsg"), D = document.getElementById("settingsSection"), x = document.getElementById("resultsSection"), k = document.getElementById("format"), M = document.getElementById("quality"), ee = document.getElementById("qualityValue"), te = document.getElementById("qualityField"), q = document.getElementById("targetWidth"), H = document.getElementById("targetHeight"), ne = document.getElementById("keepAspect"), L = document.getElementById("processBtn"), B = document.getElementById("originalPreview"), I = document.getElementById("convertedPreview"), re = document.getElementById("originalMeta"), ie = document.getElementById("convertedMeta"), A = document.getElementById("stats"), C = document.getElementById("downloadBtn"), oe = document.getElementById("resetBtn");
async function se() {
  z.hidden = false;
  try {
    await G(), S = true;
  } finally {
    z.hidden = true;
  }
  ce();
}
function ce() {
  m.addEventListener("dragover", (e) => {
    e.preventDefault(), m.classList.add("is-dragging");
  }), m.addEventListener("dragleave", () => m.classList.remove("is-dragging")), m.addEventListener("drop", (e) => {
    var _a;
    e.preventDefault(), m.classList.remove("is-dragging");
    const t = (_a = e.dataTransfer) == null ? void 0 : _a.files[0];
    t && t.type.startsWith("image/") && F(t);
  }), m.addEventListener("keydown", (e) => {
    (e.key === "Enter" || e.key === " ") && E.click();
  }), E.addEventListener("change", () => {
    var _a;
    ((_a = E.files) == null ? void 0 : _a[0]) && F(E.files[0]);
  }), M.addEventListener("input", () => {
    ee.textContent = M.value;
  }), k.addEventListener("change", ae), L.addEventListener("click", le), oe.addEventListener("click", ue);
}
function ae() {
  te.style.display = k.value === "png" ? "none" : "";
}
async function F(e) {
  u = e, p && URL.revokeObjectURL(p), d && URL.revokeObjectURL(d), p = URL.createObjectURL(e), B.src = p, await new Promise((t) => {
    B.onload = () => t();
  }), re.textContent = `${B.naturalWidth} \xD7 ${B.naturalHeight} px  |  ${b(e.size)}`, D.hidden = false, x.hidden = true;
}
async function le() {
  if (!u || !S) return;
  const e = k.value, t = parseInt(M.value, 10), r = parseInt(q.value, 10) || 0, i = parseInt(H.value, 10) || 0, n = ne.checked;
  L.disabled = true, L.textContent = "Converting...";
  try {
    const s = new Uint8Array(await u.arrayBuffer());
    let o, c;
    if (e === "webp") {
      const h = $(s, r, i, n, "png", 100);
      o = await de(h, t), c = "image/webp";
    } else {
      const h = $(s, r, i, n, e, t);
      c = e === "jpeg" ? "image/jpeg" : "image/png", o = new Blob([h], { type: c });
    }
    d && URL.revokeObjectURL(d), d = URL.createObjectURL(o), I.src = d, await new Promise((h) => {
      I.onload = () => h();
    }), ie.textContent = `${I.naturalWidth} \xD7 ${I.naturalHeight} px  |  ${b(o.size)}`;
    const l = u.size - o.size, g = Math.abs(l / u.size * 100).toFixed(1);
    l > 0 ? A.innerHTML = `<span class="saved">\u25BC ${g}% smaller</span> (${b(u.size)} \u2192 ${b(o.size)})` : l < 0 ? A.innerHTML = `<span class="increased">\u25B2 ${g}% larger</span> (${b(u.size)} \u2192 ${b(o.size)})` : A.textContent = `No change (${b(o.size)})`;
    const f = e === "jpeg" ? "jpg" : e, O = u.name.replace(/\.[^.]+$/, "");
    C.href = d, C.download = `${O}_czimg.${f}`, x.hidden = false, x.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (s) {
    alert(`Conversion error: ${s}`);
  } finally {
    L.disabled = false, L.textContent = "Convert";
  }
}
function de(e, t) {
  return new Promise((r, i) => {
    const n = new Image(), s = new Blob([e], { type: "image/png" }), o = URL.createObjectURL(s);
    n.onload = () => {
      const c = document.createElement("canvas");
      c.width = n.naturalWidth, c.height = n.naturalHeight, c.getContext("2d").drawImage(n, 0, 0), URL.revokeObjectURL(o), c.toBlob((g) => {
        g ? r(g) : i(new Error("WebP encoding is not supported in this browser"));
      }, "image/webp", t / 100);
    }, n.onerror = () => {
      URL.revokeObjectURL(o), i(new Error("Failed to load image for WebP conversion"));
    }, n.src = o;
  });
}
function ue() {
  u = null, p && (URL.revokeObjectURL(p), p = null), d && (URL.revokeObjectURL(d), d = null), B.src = "", I.src = "", E.value = "", q.value = "", H.value = "", D.hidden = true, x.hidden = true, window.scrollTo({ top: 0, behavior: "smooth" });
}
function b(e) {
  return e < 1024 ? `${e} B` : e < 1024 * 1024 ? `${(e / 1024).toFixed(1)} KB` : `${(e / (1024 * 1024)).toFixed(2)} MB`;
}
se().catch(console.error);
