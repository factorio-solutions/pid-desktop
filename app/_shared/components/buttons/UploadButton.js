import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import upload from '../../helpers/upload'

import LabeledRoundButton from './LabeledRoundButton.js'

import styles from './UploadButton.scss'


export default class UploadButton extends PureComponent {
  static propTypes = {
    onUpload:  PropTypes.func.isRequired,
    query:     PropTypes.string.isRequired,
    variables: PropTypes.object,
    label:     PropTypes.string.isRequired,
    type:      PropTypes.string,
    accept:    PropTypes.string,
    state:     PropTypes.number
  }

  constructor(props) {
    super(props)
    this.state = { uploading: false }
  }

  onFileSelected = event => {
    const { query, variables } = this.props
    this.setState({ uploading: true })
    upload(this.uploadFinished, event, query, variables)
  }

  uploadFinished = url => {
    const { onUpload } = this.props
    this.setState({ uploading: false })
    const fileName = this.fileInput.value.replace(/^.*[\\\/]/, '')
    url && onUpload(url, fileName)
  }

  render() {
    const {
      label, type, state, accept
    } = this.props

    const buttonContent = (
      <i
        className={`fa
          ${this.state.uploading ? 'fa-cloud-upload' : 'fa-file-text-o'}
          ${this.state.uploading ? styles.pulsing : undefined}
        `}
        aria-hidden="true"
      />
    )

    return (
      <span>
        <input
          key="uploadbtn-input"
          type="file"
          ref={input => { this.fileInput = input }}
          onChange={this.onFileSelected}
          className={styles.hide}
          accept={accept}
        />

        <LabeledRoundButton
          key="uploadbtn-button"
          label={label}
          type={type}
          state={state}
          onClick={() => type !== 'disabled' && this.fileInput.click()}
          content={buttonContent}
        />
      </span>
    )
  }
}
