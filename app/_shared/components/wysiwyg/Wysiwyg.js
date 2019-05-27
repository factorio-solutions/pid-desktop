import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactQuill from 'react-quill'

import { AVAILABLE_LANGUAGES } from '../../../routes.js'

import styles from './Wysiwyg.scss'
import './Wysiwyg.noHash.css'

const formats = [
  'bold', 'italic', 'strike', 'underline', 'bullet', 'list'
]

function myClipMatch(node, delta) {
  delta.ops = delta.ops.map(op => {
    if (op.insert && typeof op.insert === 'string') {
      const newOp = {
        insert: op.insert
      }

      if (op.attributes) {
        const attributes = Object.keys(op.attributes)
          .filter(attr => formats.includes(attr))
          .reduce((acc, attr) => {
            if (
              attr === 'list'
              && op.attributes[attr] !== 'bullet'
              && op.attributes[attr] !== 'ordered'
            ) {
              return acc
            }
            return {
              ...acc,
              [attr]: op.attributes[attr]
            }
          }, {})

        if (Object.keys(attributes).length > 0) {
          newOp.attributes = attributes
        }
      }

      return newOp
    }

    return undefined
  })
    .filter(attr => attr)

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
      />
      <button
        key="ql-italic"
        type="button"
        className={`ql-italic ${styles.button} fa fa-italic`}
      />
      <button
        key="ql-strike"
        type="button"
        className={`ql-strike ${styles.button} fa fa-strikethrough`}
      />
      <button
        key="ql-underline"
        type="button"
        className={`ql-underline ${styles.button} fa fa-underline`}
      />
      <button
        key="ql-bullet"
        type="button"
        className={`ql-list ${styles.button} fa fa-list-ul`}
        value="bullet"
      />
      <button
        key="ql-list"
        type="button"
        className={`ql-list ${styles.button} fa fa-list-ol`}
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
      <div className={styles.container}>
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
          formats={formats}
          onKeyDown={this.checkCharCount}
        />
        {`Max ${max} characters.`}
      </div>
    )
  }
}
