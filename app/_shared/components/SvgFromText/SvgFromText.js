import React, { Component, PropTypes } from 'react'
import styles                          from './SvgFromText.scss'

export default class SvgFromText extends Component {
  static propTypes = {
    svg:      React.PropTypes.string.isRequired,
    svgClick: React.PropTypes.func
  }

// componentDidMount(){
//   const setHeight = () => {
//     document.getElementsByClassName(styles.matchWidth)[0].style.height = window.innerHeight-155+'px'
//   }
//
//   window.addEventListener("resize", function(){
//     setHeight()
//   });
//   setHeight()
// }
//
// componentWillUnmount(){
//   window.removeEventListener("resize", ()=>{});
// }


  render(){
    const { svg, svgClick } = this.props
    function createContent () { return {__html: svg} }

    return(<div className={styles.matchWidth}  onClick={svgClick} dangerouslySetInnerHTML={createContent()} />)
  }
}
