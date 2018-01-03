import React from 'react'
import styles from './ButtonStack.scss'


export default function ButtonStack({ children, divider, style, revertDivider }) {
  const prepareContent = (content, child, index, arr) => {
    content.push(<li className={`${styles[style]}`} key={index}>{ child }</li>)
    content.push(<li className={`${styles[style]}`} key={index + 'divider'}>{ divider }</li>)

    if (arr.length - 1 === index) { // last iteration
      revertDivider && content.splice(content.length - 1, 0, content.splice(0, 1)[0]) // move last element to first place
      style === 'horizontal' && content.pop()
    }

    return content
  }

  return (<ul className={styles.ul}>
    { children.reduce(prepareContent, []) }
  </ul>)
}
