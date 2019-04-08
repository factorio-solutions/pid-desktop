import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { valueAddedTax } from '../_shared/helpers/calculatePrice'
import { t } from '../_shared/modules/localization/localization'
import { assignColorsToGroups } from '../_shared/components/garageLayout/GarageLayout'

import styles from './garage.page.scss'

const calculatePriceGenerator = garage => price => valueAddedTax(price, garage.dic ? garage.vat : 0)

function placeTooltip({
  garage,
  place,
  selected,
  time
}) {
  const contracts = garage.contracts
    .filter(contract => time.isBetween(moment(contract.from), moment(contract.to)))
    .filter(contract => contract.places.find(p => p.id === place.id) !== undefined)

  const reservation = place.reservations[0]
  const assignedColors = garage && assignColorsToGroups(garage.floors)
  const calculatePrice = calculatePriceGenerator(garage)

  return (
    <div className={styles.tooltip}>
      <table>
        <tbody>
          <tr>
            <td>{t([ 'garages', 'reservationId' ])}</td>
            <td>{reservation && reservation.id}</td>
          </tr>
          <tr>
            <td>{t([ 'garages', 'driver' ])}</td>
            <td>{reservation && reservation.user && reservation.user.full_name}</td>
          </tr>
          <tr>
            <td>{t([ 'garages', 'client' ])}</td>
            <td>
              {contracts.length > 0 && contracts
                .map(contract => contract.client)
                // Remove duplicities.
                .filter((client, index, arr) => arr.findIndexById(client.id) === index)
                .map(client => [
                  selected === 'clients' && (
                    <span className={styles.circle}>
                      <i
                        className="fa fa-circle"
                        aria-hidden="true"
                        style={{ color: assignedColors[client.id] }}
                      />
                    </span>
                  ),
                  <span>{client.name}</span>,
                  reservation
                  && reservation.client
                  && reservation.client.id === client.id
                  && (
                    <span>
                      {`(${t([ 'reservations', 'host' ])})`}
                    </span>
                  ),
                  <span>,</span>
                ].filter(o => o))
              }
              {reservation && !reservation.client && `(${t([ 'reservations', 'visitor' ])})`}
            </td>
          </tr>
          <tr>
            <td>{t([ 'garages', 'period' ])}</td>
            <td className={styles.flex}>
              {reservation && [
                (
                  <div>
                    {moment(reservation.begins_at).format('DD.MM.YYYY')}
                    {' '}
                    <br />
                    {' '}
                    {moment(reservation.begins_at).format('HH:mm')}
                  </div>
                ),
                <div className={styles.dash}>-</div>,
                (
                  <div>
                    {moment(reservation.ends_at).format('DD.MM.YYYY')}
                    <br />
                    {moment(reservation.ends_at).format('HH:mm')}
                  </div>
                )
              ]}
            </td>
          </tr>
          <tr>
            <td>{t([ 'garages', 'licencePlate' ])}</td>
            <td>{reservation && reservation.car && reservation.car.licence_plate}</td>
          </tr>
          <tr>
            <td>{t([ 'garages', 'contract' ])}</td>
            <td>
              {contracts.length > 0
              && contracts.map(contract => [ selected === 'contracts' && (
                <span
                  className={styles.circle}
                >
                  <i
                    className="fa fa-circle"
                    aria-hidden="true"
                    style={{ color: assignedColors[contract.id] }}
                  />
                </span>,
                  <span>{`${contract.name},`}</span>
              ) ])}
            </td>
          </tr>
        </tbody>
      </table>

      {(place.contracts[0] || place.pricing) && (
        <div className={styles.optional}>
          <table>
            <tbody>
              <tr>
                <td>{t([ 'garages', 'priceType' ])}</td>
                <td>
                  {place.contracts[0]
                    ? t([ 'garages', 'longterm' ])
                    : place.pricing
                      ? t([ 'garages', 'shortterm' ])
                      : ''
                  }
                </td>
              </tr>
              {place.contracts[0] && place.contracts[0].rent && (
                <tr>
                  <td>{t([ 'garages', 'pricePerSpot' ])}</td>
                  <td>
                    {calculatePrice(place.contracts[0].rent.price)}
                    {' '}
                    {place.contracts[0].rent.currency.symbol}
                  </td>
                </tr>
              )}
              {!place.contracts[0] && place.pricing && place.pricing.flat_price && (
                <tr>
                  <td>{t([ 'garages', 'flatPrice' ])}</td>
                  <td>
                    {calculatePrice(place.pricing.flat_price)}
                    {' '}
                    {place.pricing.currency.symbol}
                  </td>
                </tr>
              )}
              {!place.contracts[0] && place.pricing && place.pricing.exponential_12h_price && (
                <tr>
                  <td>{t([ 'garages', '12HourPrice' ])}</td>
                  <td>
                    {calculatePrice(place.pricing.exponential_12h_price)}
                    {' '}
                    {place.pricing.currency.symbol}
                  </td>
                </tr>
              )}
              {!place.contracts[0] && place.pricing && place.pricing.exponential_day_price && (
                <tr>
                  <td>{t([ 'garages', 'dayPrice' ])}</td>
                  <td>
                    {calculatePrice(place.pricing.exponential_day_price)}
                    {' '}
                    {place.pricing.currency.symbol}
                  </td>
                </tr>
              )}
              {!place.contracts[0] && place.pricing && place.pricing.exponential_week_price && (
                <tr>
                  <td>{t([ 'garages', 'weekPrice' ])}</td>
                  <td>
                    {calculatePrice(place.pricing.exponential_week_price)}
                    {' '}
                    {place.pricing.currency.symbol}
                  </td>
                </tr>
              )}
              {!place.contracts[0] && place.pricing && place.pricing.exponential_month_price && (
                <tr>
                  <td>{t([ 'garages', 'monthPrice' ])}</td>
                  <td>
                    {calculatePrice(place.pricing.exponential_month_price)}
                    {' '}
                    {place.pricing.currency.symbol}
                  </td>
                </tr>
              )}
              {!place.contracts[0] && place.pricing && place.pricing.weekend_price && (
                <tr>
                  <td>{t([ 'garages', 'weekendPrice' ])}</td>
                  <td>
                    {calculatePrice(place.pricing.weekend_price)}
                    {' '}
                    {place.pricing.currency.symbol}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

placeTooltip.propTypes = {
  garage:   PropTypes.object,
  place:    PropTypes.object,
  selected: PropTypes.string,
  time:     PropTypes.objectOf([
    PropTypes.string,
    PropTypes.object
  ])
}

export default placeTooltip
