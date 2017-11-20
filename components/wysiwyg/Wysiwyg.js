import React, { Component, PropTypes } from 'react'
import styles                          from './Wysiwyg.scss'
import ReactQuill                      from 'react-quill'
import { AVAILABLE_LANGUAGES }         from '../../../routes.js'


export default class Wysiwyg extends Component {
  static propTypes = {
    content:      PropTypes.string,
    maxLength:    PropTypes.number,
    onChange:     PropTypes.func,
    onLangClick:  PropTypes.func,
    activeLang:   PropTypes.string,
    max:          PropTypes.number
  }

  componentDidMount(){
    document.getElementsByClassName('quill-toolbar')[0].style.display = 'inline'
  }

  render(){
    const { content, maxLength, onChange, onLangClick, activeLang, max } = this.props

    var menu = [
        { type:'bold',      value: "Bold",      label:'Bold',       children: <button className={styles.button}><i className="fa fa-bold" aria-hidden="true"></i></button> },
        { type:'italic',    value: "Italic",    label:'Italic',     children: <button className={styles.button}><i className="fa fa-italic" aria-hidden="true"></i></button> },
        { type:'strike',    value: "Strike",    label:'Strike',     children: <button className={styles.button}><i className="fa fa-strikethrough" aria-hidden="true"></i></button> },
        { type:'underline', value: "Underline", label:'Underline',  children: <button className={styles.button}><i className="fa fa-underline" aria-hidden="true"></i></button> },

        { type:'bullet',    value: "Bullet",    label:'Bullet',     children: <button className={styles.button}><i className="fa fa-list-ul" aria-hidden="true"></i></button> },
        { type:'list',      value: "List",      label:'List',       children: <button className={styles.button}><i className="fa fa-list-ol" aria-hidden="true"></i></button> }
    ]

    const prepareLanguages = (lang, index) => {
      const languageClick = () => {onLangClick(lang)}
      return <span key={index}><button type="button" className={`${styles.button} ${styles.floatRight} ${lang == activeLang && styles.active}`} onClick={languageClick} >{lang.toUpperCase()}</button></span>
    }

    const charCount = (e) => {
      if(e.which != 8 && e.target.children[0].innerText.length > max){
        e.preventDefault()
      }
    }


    return (
      <div>
        { AVAILABLE_LANGUAGES.map(prepareLanguages) }

        <ReactQuill value={content} onChange={onChange}>
          <ReactQuill.Toolbar key="toolbar" ref="toolbar" items={menu} />
          <div className={`quill-contents ${styles.editor}`} key="editor" ref="editor" onKeyDown={charCount}/>
        </ReactQuill>
        
        Max {max} characters.
      </div>
    )
  }
}
