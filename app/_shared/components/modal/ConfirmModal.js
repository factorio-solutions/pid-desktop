import React from 'react'

import Form from '../form/Form'

import styles from './Modal.scss'


export default function ConfirmModal({ question, onConfirm, onBack }) {
  return (
    <Form onSubmit={onConfirm} onBack={onBack} submitable>
      {question}
    </Form>
  )
}
