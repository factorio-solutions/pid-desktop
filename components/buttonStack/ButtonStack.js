import React, { Component, PropTypes }  from 'react'
import styles                           from './ButtonStack.scss'


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
}
