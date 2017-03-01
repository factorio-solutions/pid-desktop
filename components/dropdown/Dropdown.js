import React, { Component, PropTypes }  from 'react'
import ReactDOM                         from 'react-dom'
<<<<<<< HEAD
import styles                           from './Dropdown.scss'
=======

import styles from './Dropdown.scss'
>>>>>>> feature/new_api


// label = button label if no item selected
// content = dropdown content, structure: [{label: ..., onClick: ... }, ... ]
// style = sets style, can be 'dark'/'light' (default is 'dark'), more can be created
// selected = index of select item in content
// hover = toggle on hover?
// fillParent = flag to indicate whenever or not to fill parent element widthvise
<<<<<<< HEAD

export default class Dropdown extends Component{
  static propTypes = {
    label:       PropTypes.string.isRequired,
    content:     PropTypes.array.isRequired,
    style:       PropTypes.string,
    selected:    PropTypes.number,
    hover:       PropTypes.bool,
    onChange:    PropTypes.func
  }
  
  static defaultProps = {
    hover:       false,
    style:       'dark'
=======
export default class Dropdown extends Component {
  static propTypes = {
    label:    PropTypes.string.isRequired,
    content:  PropTypes.array.isRequired,
    style:    PropTypes.string,
    selected: PropTypes.number,
    hover:    PropTypes.bool,
    onChange: PropTypes.func
  }

  static defaultProps = {
    hover: false,
    style: 'dark'
>>>>>>> feature/new_api
  }

  constructor(props) {
     super(props);
     this.state = {selected: this.props.selected}
  }

  componentWillReceiveProps(nextProps) {
    this.validateContent(nextProps)
  }

  componentDidMount(){
    this.validateContent(this.props)
  }

<<<<<<< HEAD

=======
>>>>>>> feature/new_api
  validateContent(nextProps){
    if (nextProps.content.length == 1){ // if only one item, autoselect it
      this.setState({selected: 0})
      ReactDOM.findDOMNode(this).children[0].classList.add(styles.singleItem)
    } else {
      this.setState({selected: nextProps.selected})
    }
  }

  render(){
    const { label, content, selected, hover, style, onChange } = this.props

    const prepareContent = (item, index, arr) => {
      const handleItemClick = () => {
        typeof item.onClick === 'function' && item.onClick()
        this.setState({selected: index})
        typeof onChange === "function" && onChange(index, true)// for form
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
      var ul = ReactDOM.findDOMNode(this).children[1]
      !hover && ul.classList.contains(styles.hidden) ? unhide() : hide()
    }

    const hide = ()=>{
      var ul = ReactDOM.findDOMNode(this).children[1]

      ul.classList.add(styles.hidden)
      setTimeout(function() {
        ul.classList.add(styles.display)
      }, 250);
    }

    const unhide = () => {
      if (content.length > 1){
        var element = ReactDOM.findDOMNode(this).children[1]
          , buttonPosition = ReactDOM.findDOMNode(this).children[0].getBoundingClientRect()

        element.classList.remove(styles.display)
        element.classList.remove(styles.hidden)
        element.style.width = buttonPosition.width+"px"
<<<<<<< HEAD
        element.style.top = (!hover)?buttonPosition.top+buttonPosition.height:buttonPosition.top+"px"
=======
        element.style.top = ((!hover)?(buttonPosition.bottom+document.body.scrollTop):(buttonPosition.top+document.body.scrollTop))+"px"
>>>>>>> feature/new_api
        element.style.left = buttonPosition.left+"px"
      }
    }


    const onMouseEnter = function(){
      if (hover){
        unhide()
      }
    }

    const onMouseLeave = function(){
      if (hover){
        hide()
      }
    }

    const onBlur = function (e){
      hide();
    }

    return(
      <div>
        <button
          type='button'
          className={`${styles.button} ${styles[style]}`}
          onClick={toggleDropdown}
          onMouseEnter={onMouseEnter}
          onBlur={onBlur}>
            <span className={styles.marginCorrection}> {this.state.selected==undefined||content[this.state.selected]==undefined ? label : content[this.state.selected].label} </span>
<<<<<<< HEAD

            <i className={`fa fa-caret-down ${styles.float}`} aria-hidden="true"></i>

=======
            <i className={`fa fa-caret-down ${styles.float}`} aria-hidden="true"></i>
>>>>>>> feature/new_api
        </button>
        <ul className={`${styles.drop} ${styles.hidden} ${styles.display}`} onMouseLeave={onMouseLeave}>
          {content.map(prepareContent)}
        </ul>
      </div>
    )
  }
}
