import React, { Component, PropTypes } from 'react'

import upload from '../../helpers/upload'

import LabeledRoundButton from './LabeledRoundButton.js'

import styles from './UploadButton.scss'


export default class UploadButton extends Component {
  static propTypes = {
    onUpload:  PropTypes.function.isRequired,
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

  render() {
    const { onUpload, query, variables, label, type, state, accept } = this.props

    const uploadFinished = url => {
      this.setState({ uploading: false })
      const fileName = this.fileInput.value.replace(/^.*[\\\/]/, '')
      url && onUpload(url, fileName)
    }

    const onFileSelected = event => {
      this.setState({ uploading: true })
      upload(uploadFinished, event, query, variables)
    }

    return (<span>
      <input type="file" ref={input => { this.fileInput = input }} onChange={onFileSelected} className={styles.hide} accept={accept} />
      <LabeledRoundButton
        label={label}
        type={type}
        state={state}
        onClick={() => { if (type !== 'disabled') { this.fileInput.click() } }}
        content={<i className={`fa ${this.state.uploading ? 'fa-cloud-upload' : 'fa-file-text-o'} ${this.state.uploading && styles.pulsing}`} aria-hidden="true" />}
      />
    </span>)
  }
}
