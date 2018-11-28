import React, { Component, PropTypes } from 'react'

import styles from './SectionWithHeader.scss'

export default class SectionWithHeader extends Component {
  static propTypes = {
    children: PropTypes.object,
    header:   PropTypes.string
  }

  render() {
    const { children, header } = this.props

    return (
      <div>
        <h2>{header}</h2>
        <div className={styles.section}>
          {children}
        </div>
      </div>
    )
  }
}
