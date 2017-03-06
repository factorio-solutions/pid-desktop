import React, { Component, PropTypes } from 'react'

import styles                          from './SvgFromText.scss'


export default function SvgFromText ({ svg, svgClick })  {
  return(
    <div className={styles.matchWidth}  onClick={svgClick} dangerouslySetInnerHTML={{__html: svg}} />
  )
}
