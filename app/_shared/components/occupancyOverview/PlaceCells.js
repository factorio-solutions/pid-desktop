import React from 'react'
import PropTypes from 'prop-types'

import Cell from './Cell'

function PlaceCells({
  cellCount,
  cellWidth,
  place,
  now,
  from,
  isIe,
  duration,
  renderTextInReservation,
  rendered,
  onReservationClick,
  showDetails,
  currentUser,
  row
}) {
  return new Array(cellCount)
    .fill(null)
    .map((_, index) => (
      <Cell
        place={place}
        index={index}
        now={now}
        from={from}
        isIe={isIe}
        duration={duration}
        cellWidth={cellWidth}
        renderTextInReservation={renderTextInReservation}
        rendered={rendered}
        onReservationClick={onReservationClick}
        showDetails={showDetails}
        currentUser={currentUser}
        row={row}
      />
    ))
}

PlaceCells.propTypes = {
  cellCount:               PropTypes.number.isRequired,
  cellWidth:               PropTypes.number.isRequired,
  place:                   PropTypes.object,
  now:                     PropTypes.number,
  from:                    PropTypes.object,
  isIe:                    PropTypes.bool,
  duration:                PropTypes.string,
  renderTextInReservation: PropTypes.bool,
  rendered:                PropTypes.bool,
  onReservationClick:      PropTypes.func,
  showDetails:             PropTypes.bool,
  currentUser:             PropTypes.object,
  row:                     PropTypes.object
}

export default React.memo(PlaceCells)
