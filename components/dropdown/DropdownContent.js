import React, { Component, PropTypes }  from 'react'
import ReactDOM                         from 'react-dom'

import styles from './Dropdown.scss'


// label = button label if no item selected
// content = dropdown content, structure: [{label: ..., onClick: ... }, ... ]
// style = sets style, can be 'dark'/'light' (default is 'dark'), more can be created
// selected = index of select item in content
// fillParent = flag to indicate whenever or not to fill parent element widthvise
export default class DropdownContent extends Component {
  static propTypes = {
    content:   PropTypes.array.isRequired,
    style:     PropTypes.string,
  }

  static defaultProps = { style: 'dark' }

  // constructor(props) {
  //    super(props);
  //    this.state = { selected: this.props.selected }
  // }

  render(){
    const { content, style, children } = this.props


    const toggleDropdown = () => { ReactDOM.findDOMNode(this).children[1].classList.contains(styles.hidden) ? unhide() : hide() }

    const hide = ()=>{
      const ul = ReactDOM.findDOMNode(this).children[1]
      ul.classList.add(styles.hidden)
      setTimeout(function() { ul.classList.add(styles.display) }, 250);
    }

    const unhide = () => {
      const ul = ReactDOM.findDOMNode(this).children[1]
      ul.classList.remove(styles.display)
      ul.classList.remove(styles.hidden)
      // ul.style.width = ReactDOM.findDOMNode(this).children[0].getBoundingClientRect().width+"px"
    }

    const hideDropdown = (row) => {
      return {...row, onClick: ()=> {
        hide()
        row.onClick()
      }}
    }


    return(
      <div>
        <div onClick={toggleDropdown}>
          {children}
        </div>
        <ul className={`${styles.drop} ${styles.hidden} ${styles.display}`}>
          {content.map(hideDropdown)}
        </ul>
      </div>
    )
  }
}
