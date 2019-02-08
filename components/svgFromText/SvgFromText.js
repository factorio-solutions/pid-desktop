import React from 'react'

import styles from './SvgFromText.scss'

import IsIe from '../../helpers/internetExplorer'

const internetExplorer = IsIe()

export default function SvgFromText({ identfier, svg, svgClick, rotate }) {
  const setSvgWidth = containerDiv => {
    if (containerDiv) {
      if (internetExplorer) {
        if (containerDiv.children[0]) {
          containerDiv.children[0].style.height = '1350px'
        }
      } else if (rotate) {
        if (containerDiv.children[0]) {
          containerDiv.children[0].style.height = `${containerDiv.getBoundingClientRect().width}px`
        }
      } else {
        containerDiv.children[0] && containerDiv.children[0].removeAttribute('style')
      }
    }
  }

  return (
    <div
      ref={setSvgWidth}
      className={`${styles.matchWidth} ${rotate && styles.rotate} svgFromText id-${identfier}`}
      onClick={svgClick}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
