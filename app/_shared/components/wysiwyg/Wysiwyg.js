import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactQuill from 'react-quill'

import { AVAILABLE_LANGUAGES } from '../../../routes.js'

import styles from './Wysiwyg.scss'

function myClipMatch(node, delta) {
  const ops = []
  delta.ops.forEach(op => {
    if (op.insert && typeof op.insert === 'string') {
      ops.push({
        insert: op.insert
      })
    }
  })
  delta.ops = ops
  return delta
}

export default class Wysiwyg extends Component {
  static propTypes = {
    content:     PropTypes.string,
    onChange:    PropTypes.func,
    onLangClick: PropTypes.func,
    activeLang:  PropTypes.string,
    max:         PropTypes.number
  }

  formats = [
    'bold', 'italic', 'strike', 'underline', 'bullet', 'list'
  ]

  modules = {
    toolbar:   '#toolbar',
    clipboard: {
      matchers: [
        [ Node.ELEMENT_NODE, myClipMatch ]
      ]
    }
  }

  componentDidMount() {
    document.getElementsByClassName('ql-hidden')[0].style.display = 'none'
    document.getElementsByClassName('ql-clipboard')[0].style.display = 'none'
    const editor = document.getElementsByClassName('ql-editor')[0]
    editor.style.outline = 'none'
    editor.style.height = '100%'
    document.getElementsByClassName('ql-container')[0].style.height = '90%'
  }

  componentDidUpdate() {
    let elements = Array.from(document.getElementsByClassName(styles.button))

    // Filter out languages buttons.
    elements = elements.filter(element => !element.classList.contains(styles.floatRight))

    elements.forEach(element => {
      if (element.classList.contains('ql-active')) {
        if (!element.classList.contains(styles.active)) {
          element.classList.add(styles.active)
        }
      } else if (element.classList.contains(styles.active)) {
        element.classList.remove(styles.active)
      }
    })
  }

  clipboardMatcher = (node, delta) => {
    const ops = []
    delta.ops.forEach(op => {
      if (op.insert && typeof op.insert === 'string') {
        ops.push({
          insert: op.insert
        })
      }
    })
    delta.ops = ops
    return delta
  }

  onEditorChange = (html, delta, source) => {
    const { onChange } = this.props
    if (source === 'user') {
      onChange(html)
    }
  }

  checkCharCount = e => {
    const { max } = this.props
    if (e.which !== 8 && e.target.children[0].innerText.length > max) {
      e.preventDefault()
    }
  }

  CustomToolbar = () => (
    <div id="toolbar">
      <button
        key="ql-bold"
        type="button"
        className={`ql-bold ${styles.button} fa fa-bold`}
        onClick={() => this.forceUpdate()}
      />
      <button
        key="ql-italic"
        type="button"
        className={`ql-italic ${styles.button} fa fa-italic`}
        onClick={() => this.forceUpdate()}
      />
      <button
        key="ql-strike"
        type="button"
        className={`ql-strike ${styles.button} fa fa-strikethrough`}
        onClick={() => this.forceUpdate()}
      />
      <button
        key="ql-underline"
        type="button"
        className={`ql-underline ${styles.button} fa fa-underline`}
        onClick={() => this.forceUpdate()}
      />
      <button
        key="ql-bullet"
        type="button"
        className={`ql-list ${styles.button} fa fa-list-ul`}
        onClick={() => this.forceUpdate()}
        value="bullet"
      />
      <button
        key="ql-list"
        type="button"
        className={`ql-list ${styles.button} fa fa-list-ol`}
        onClick={() => this.forceUpdate()}
        value="ordered"
      />
    </div>
  )

  renderLangButtons = lang => {
    const { onLangClick, activeLang } = this.props
    const languageClick = () => onLangClick(lang)
    return (
      <span key={lang}>
        <button
          type="button"
          className={`${styles.button} ${styles.floatRight} ${lang === activeLang ? styles.active : undefined}`}
          onClick={languageClick}
        >
          {lang.toUpperCase()}
        </button>
      </span>
    )
  }

  render() {
    const { CustomToolbar } = this
    const { content, max } = this.props

    return (
      <div>
        {AVAILABLE_LANGUAGES.map(this.renderLangButtons)}
        <CustomToolbar />
        <ReactQuill
          value={content || ''}
          style={{
            borderRadius: '5px',
            height:       '200px',
            border:       '1px solid #5a5a5a',
            marginTop:    '5px',
            marginRight:  '5px',
            zIndex:       '3',
            outline:      'none',
            overflowX:    'hidden',
            overflowY:    'auto',
            lineHeight:   '0.4',
            padding:      '12px 15px'
          }}
          onChange={this.onEditorChange}
          modules={this.modules}
          formats={this.formats}
          onKeyDown={this.checkCharCount}
        />
        {`Max ${max} characters.`}
      </div>
    )
  }
}
