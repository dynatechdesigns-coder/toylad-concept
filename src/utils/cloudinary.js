const widths = [400, 800, 1200, 1600]

// Adds delivery transformations to a Cloudinary upload URL: best format, automatic quality, capped width.
export function cloudinaryUrl(url, width) {
  return url.replace('/upload/', `/upload/f_auto,q_auto,c_limit,w_${width}/`)
}

export function cloudinarySrcSet(url) {
  return widths.map((width) => `${cloudinaryUrl(url, width)} ${width}w`).join(', ')
}
