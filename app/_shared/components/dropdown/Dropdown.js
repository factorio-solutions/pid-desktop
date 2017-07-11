import React, { Component, PropTypes }  from 'react'
import ReactDOM                         from 'react-dom'

import styles from './Dropdown.scss'


// label = button label if no item selected
// content = dropdown content, structure: [{label: ..., onClick: ... }, ... ]
// style = sets style, can be 'dark'/'light' (default is 'dark'), more can be created
// selected = index of select item in content
// fillParent = flag to indicate whenever or not to fill parent element widthvise
// position 'fixed' / 'absolute' => default: 'absolute'

export default class Dropdown extends Component {
  static propTypes = {
    label:     PropTypes.string.isRequired,
    content:   PropTypes.array.isRequired,
    style:     PropTypes.string,
    selected:  PropTypes.number,
    onChange:  PropTypes.func,
    fixed:     PropTypes.bool,
    highlight: PropTypes.bool,
    position:  PropTypes.string,
  }

  static defaultProps = {
    hover: false,
    style: 'dark'
  }

  constructor(props) {
     super(props);
     this.state = { selected: this.props.selected }
  }

  componentWillReceiveProps(nextProps) {
    this.validateContent(nextProps)
  }

  componentDidMount(){
    this.validateContent(this.props)
  }

  validateContent(nextProps){
    if (nextProps.content.length == 1){ // if only one item, autoselect it
      this.setState({selected: 0})
      ReactDOM.findDOMNode(this).children[0].classList.add(styles.singleItem)
    } else {
      this.setState({selected: nextProps.selected})
    }
  }

  render(){
    const { label, content, selected, style, onChange, fixed, highlight, position } = this.props

    const prepareContent = (item, index, arr) => {
      const handleItemClick = () => {
        typeof item.onClick === 'function' && item.onClick()
        this.setState({selected: index})
        typeof onChange === "function" && onChange(index, true)// for form
        // browser.name === 'safari' && hide() // safari not handles onBlur well, so hide on select
        hide()
      }

      return(
        <li key={index} className={index==this.state.selected?styles.selected:''} onClick={handleItemClick} >
          <label>
            {item.label}
          </label>
        </li>
      )
    }

    const toggleDropdown = () => {
      const ul = ReactDOM.findDOMNode(this).children[1]
      ul.classList.contains(styles.hidden) ? unhide() : hide()
    }

    const onBlur = (e) => { hide() }

    const hide = ()=>{
      const ul = ReactDOM.findDOMNode(this).children[1]

      ul.classList.add(styles.hidden)
      setTimeout(function() {
        ul.classList.add(styles.display)
      }, 250);
    }

    const unhide = () => {
      if (content.length > 1){
        const element = ReactDOM.findDOMNode(this).children[1]
            , buttonPosition = ReactDOM.findDOMNode(this).children[0].getBoundingClientRect()

        element.classList.remove(styles.display)
        element.classList.remove(styles.hidden)
        element.style.width = buttonPosition.width+"px"
      }
    }


    return(
      <div>
        <button
          type='button'
          className={`${styles.button} ${styles[style]} ${highlight && (this.state.selected === -1 || this.state.selected === undefined) && styles.highlighted}`}
          onClick={toggleDropdown}
          onBlur={onBlur}>
            <span className={styles.marginCorrection}> {this.state.selected==undefined||content[this.state.selected]==undefined ? label : content[this.state.selected].label} </span>
            {content.length > 1 && <i className={`fa fa-caret-down ${styles.float}`} aria-hidden="true"></i>}
        </button>
        <ul className={`${styles.drop} ${styles.hidden} ${styles.display} ${position==='fixed' ? styles.fixed : styles.absolute}`}>
          {content.map(prepareContent)}
        </ul>
      </div>
    )
  }
}
