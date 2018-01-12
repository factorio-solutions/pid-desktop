function estimateTextWidth(size, txt) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  context.font = `${size}px Roboto Condensed`
  return context.measureText(txt).width + 14 // + offset
}

export function getTextWidth12px(txt) {
  return estimateTextWidth(12, txt)
}

export function getTextWidth14px(txt) {
  return estimateTextWidth(14, txt)
}
