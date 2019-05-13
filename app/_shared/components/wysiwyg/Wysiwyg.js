import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactQuill, { Rest } from 'react-quill'
import Delta from 'quill-delta'
import 'react-quill/dist/quill.snow.css'

import { AVAILABLE_LANGUAGES } from '../../../routes.js'

import styles from './Wysiwyg.scss'


export default class Wysiwyg extends Component {
  static propTypes = {
    content:     PropTypes.string,
    onChange:    PropTypes.func,
    onLangClick: PropTypes.func,
    activeLang:  PropTypes.string,
    max:         PropTypes.number
  }

  modules = {
    toolbar: {
      container: '#my-quill-toolbar'
    }
  }

  toolbarMenu = [
    {
      type:     'bold',
      value:    'Bold',
      label:    'Bold',
      children: (
        <button className={styles.button}>
          <i className="fa fa-bold" aria-hidden="true" />
        </button>
      )
    },
    {
      type:     'italic',
      value:    'Italic',
      label:    'Italic',
      children: (
        <button className={styles.button}>
          <i className="fa fa-italic" aria-hidden="true" />
        </button>
      )
    },
    {
      type:     'strike',
      value:    'Strike',
      label:    'Strike',
      children: (
        <button className={styles.button}>
          <i className="fa fa-strikethrough" aria-hidden="true" />
        </button>
      )
    },
    {
      type:     'underline',
      value:    'Underline',
      label:    'Underline',
      children: (
        <button className={styles.button}>
          <i className="fa fa-underline" aria-hidden="true" />
        </button>
      )
    },
    {
      type:     'bullet',
      value:    'Bullet',
      label:    'Bullet',
      children: (
        <button className={styles.button}>
          <i className="fa fa-list-ul" aria-hidden="true" />
        </button>
      )
    },
    {
      type:     'list',
      value:    'List',
      label:    'List',
      children: (
        <button className={styles.button}>
          <i className="fa fa-list-ol" aria-hidden="true" />
        </button>
      )
    }
  ]

  formats = [
    'bold', 'italic', 'strike', 'underline'
  ]


  constructor(props) {
    super(props)

    this.toolbar = React.createRef()
    this.editor = React.createRef()
  }

  componentDidMount() {
    // document.getElementsByClassName('quill-toolbar')[0].style.display = 'inline'
  }

  onEditorChange = html => {
    const { onChange } = this.props
    if (this.editor.current) {
      onChange(this.editor.current.editor.getContents())
    } else {
      onChange(new Delta(html))
    }
  }

  render() {
    const {
      content, onChange, onLangClick, activeLang, max
    } = this.props

    const CustomToolbar = () => (
      <div id="toolbar">
        <button className={`ql-bold ${styles.button}`}>
          <i className="fa fa-bold" aria-hidden="true" />
        </button>
        <button className={`ql-italic ${styles.button}`}>
          <i className="fa fa-italic" aria-hidden="true" />
        </button>
        <button className={`ql-strike ${styles.button}`}>
          <i className="fa fa-strikethrough" aria-hidden="true" />
        </button>
        <button className={`ql-underline ${styles.button}`}>
          <i className="fa fa-underline" aria-hidden="true" />
        </button>
      </div>
    )


    const prepareLanguages = (lang, index) => {
      const languageClick = () => onLangClick(lang)
      return (
        <span key={index}>
          <button
            type="button"
            className={`${styles.button} ${styles.floatRight} ${lang === activeLang && styles.active}`}
            onClick={languageClick}
          >
            {lang.toUpperCase()}
          </button>
        </span>
      )
    }

    const charCount = e => {
      if (e.which !== 8 && e.target.children[0].innerText.length > max) {
        e.preventDefault()
      }
    }

    return (
      <div>
        { AVAILABLE_LANGUAGES.map(prepareLanguages)}
        {/* <CustomToolbar /> */}
        <ReactQuill.Toolbar id="my-quill-toolbar" key="toolbar" ref={this.toolbar} items={this.toolbarMenu} />
        <ReactQuill
          value={new Delta(content)}
          onChange={this.onEditorChange}
          modules={this.modules}
          formats={this.formats}
          ref={this.editor}
        />
        {/* <React.Fragment>
             */}
        {/* <div className={`quill-contents ${styles.editor}`} key="editor" ref={this.editor} onKeyDown={charCount} /> */}
        {/* </React.Fragment> */}
        {/* </ReactQuill> */}
        {`Max ${max} characters.`}
      </div>
    )
  }
}
