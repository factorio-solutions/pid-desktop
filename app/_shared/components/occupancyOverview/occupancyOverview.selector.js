import React from 'react'
import  { createSelector } from 'reselect'
import Cell from './Cell'


export const a = 0

export const getCellSelector = () => createSelector(
  state => state.cellCount,
  state => state.cellWidth,
  state => state.place,
  state => state.now,
  state => state.from,
  state => state.isIe,
  state => state.duration,
  state => state.renderTextInReservation,
  state => state.rendered,
  state => state.onReservationClick,
  state => state.showDetails,
  state => state.currentUser,
  state => state.row,
  (
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
  ) => {
    const cells = new Array(cellCount)

    for (let index = 0; index < cells.length; index += 1) {
      cells[index] = (
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
      )
    }

    return cells
  }
)
