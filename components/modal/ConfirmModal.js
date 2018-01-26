import React from 'react'

import Form from '../form/Form'


export default function ConfirmModal({ question, onConfirm, onBack }) {
  return (
    <Form onSubmit={onConfirm} onBack={onBack} submitable modal>
      {question}
    </Form>
  )
}
