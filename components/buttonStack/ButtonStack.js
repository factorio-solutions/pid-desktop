import React, { Component, PropTypes }  from 'react'
import styles                           from './ButtonStack.scss'


<<<<<<< HEAD
export default class ButtonStack extends Component{
  static propTypes = {
    divider:       PropTypes.object.isRequired,
    style:         PropTypes.string,
    revertDivider: PropTypes.bool
    }

  render(){
    const { children, divider, style, revertDivider } = this.props

    const prepareContent = (children) => {
      let content = []
      children.forEach(function(child, index, arr){
        revertDivider && content.push(<li className={`${styles[style]}`} key={index*2+1}>{divider}</li>)
        content.push(<li className={`${styles[style]}`} key={index*2}>{child}</li>)
        !revertDivider && content.push(<li className={`${styles[style]}`} key={index*2+1}>{divider}</li>)
      })

      style == 'horizontal' && content.pop()

      return content
    }

    return(
      <ul className={styles.ul}>
        {prepareContent(children)}
      </ul>
    )
  }
=======
export default function ButtonStack ({ children, divider, style, revertDivider })  {

  const prepareContent = (content, child, index, arr) => {
    content.push(<li className={`${styles[style]}`} key={index}>{ child }</li>)
    content.push(<li className={`${styles[style]}`} key={index+'divider'}>{ divider }</li>)

    if (arr.length-1 == index){ // last iteration
      revertDivider && content.splice(content.length-1, 0, content.splice(0,1)[0]) // move last element to first place
      style == 'horizontal' && content.pop()
    }

    return content
  }

  return(
    <ul className={styles.ul}>
      { children.reduce(prepareContent, []) }
    </ul>
  )
>>>>>>> feature/new_api
}
