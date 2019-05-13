import React from 'react'
import PropTypes from 'prop-types'

import { t } from '../../../_shared/modules/localization/localization'

import Form from '../../../_shared/components/form/Form'
import Input from '../../../_shared/components/input/Input'
import Modal from '../../../_shared/components/modal/Modal'

const ModalForm = ({
  newNote,
  setNewNote,
  editReservationNote,
  setNewNoteReservation
}) => (
  <Form
    onSubmit={editReservationNote}
    onBack={setNewNoteReservation}
    submitable
    margin={false}
    modal
  >
    <Input
      onChange={setNewNote}
      label={t([ 'reservations', 'newNote' ])}
      value={newNote}
      align="center"
      onEnter={editReservationNote}
      key="newNoteInput"
    />
  </Form>
)

ModalForm.propTypes = {
  newNote:               PropTypes.string,
  setNewNote:            PropTypes.func,
  editReservationNote:   PropTypes.func,
  setNewNoteReservation: PropTypes.func
}

const reservationNewNoteModal = ({
  showModal,
  ...props
}) => (
  <Modal
    content={<ModalForm {...props} />}
    show={showModal}
  />
)

reservationNewNoteModal.propTypes = {
  showModal: PropTypes.bool
}

export default reservationNewNoteModal
