import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { valueAddedTax }  from '../_shared/helpers/calculatePrice'
import { assignColorsToGroups } from '../_shared/components/garageLayout/GarageLayout'

import { t } from '../_shared/modules/localization/localization'

import styles from './garage.page.scss'

const calculatePrice = (price, garage) => valueAddedTax(price, garage.dic ? garage.vat : 0)

const PriceRow = ({
  translateKey, price, symbol
}) => {
  return (
    <tr>
      <td>{t([ 'garages', translateKey ])}</td>
      <td>
        {price}
        {' '}
        {symbol}
      </td>
    </tr>
  )
}

PriceRow.propTypes = {
  translateKey: PropTypes.string,
  price:        PropTypes.string,
  symbol:       PropTypes.string
}

const garagePlaceTooltip = ({
  place, reservation, contracts, selected, garage
}) => {
  const assignedColors = garage && assignColorsToGroups(garage.floors)
  return (
    <div className={styles.tooltip}>
      <div>
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
                    reservation && reservation.client && reservation.client.id === client.id && (
                      <span>
                        {'('}
                        {t([ 'reservations', 'host' ])}
                        {')'}
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
                      <br />
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
                {contracts.length > 0 && contracts.map(contract => [
                  selected === 'contracts' && (
                    <span className={styles.circle}>
                      <i
                        className="fa fa-circle"
                        aria-hidden="true"
                        style={{ color: assignedColors[contract.id] }}
                      />
                    </span>
                  ),
                  (
                    <span>
                      {contract.name}
                      {','}
                    </span>
                  )
                ])}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {(place.contracts[0] || place.pricing) && (
        <div className={styles.optional}>
          <table>
            <tbody>
              <tr>
                <td>{t([ 'garages', 'priceType' ])}</td>
                <td>
                  {
                    place.contracts[0]
                      ? t([ 'garages', 'longterm' ])
                      : place.pricing
                        ? t([ 'garages', 'shortterm' ])
                        : ''
                  }
                </td>
              </tr>
              {place.contracts[0] && place.contracts[0].rent && (
                <PriceRow
                  translateKey="pricePerSpot"
                  price={calculatePrice(place.contracts[0].rent.price, garage)}
                  symbol={place.contracts[0].rent.currency.symbol}
                />
              )}
              {!place.contracts[0] && place.pricing && [
                place.pricing.flat_price && (
                  <PriceRow
                    translateKey="flatPrice"
                    price={calculatePrice(place.pricing.flat_price, garage)}
                    symbol={place.pricing.currency.symbol}
                  />
                ),
                place.pricing.exponential_12h_price && (
                  <PriceRow
                    translateKey="12HourPrice"
                    price={calculatePrice(place.pricing.exponential_12h_price, garage)}
                    symbol={place.pricing.currency.symbol}
                  />
                ),
                place.pricing.exponential_day_price && (
                  <PriceRow
                    translateKey="dayPrice"
                    price={calculatePrice(place.pricing.exponential_day_price, garage)}
                    symbol={place.pricing.currency.symbol}
                  />
                ),
                place.pricing.exponential_week_price && (
                  <PriceRow
                    translateKey="weekPrice"
                    price={calculatePrice(place.pricing.exponential_week_price, garage)}
                    symbol={place.pricing.currency.symbol}
                  />
                ),
                place.pricing.exponential_month_price && (
                  <PriceRow
                    translateKey="monthPrice"
                    price={calculatePrice(place.pricing.exponential_month_price, garage)}
                    symbol={place.pricing.currency.symbol}
                  />
                ),
                place.pricing.weekend_price && (
                  <PriceRow
                    translateKey="weekendPrice"
                    price={calculatePrice(place.pricing.weekend_price, garage)}
                    symbol={place.pricing.currency.symbol}
                  />
                )
              ]}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

garagePlaceTooltip.propTypes = {
  place:       PropTypes.object,
  reservation: PropTypes.object,
  contracts:   PropTypes.object,
  selected:    PropTypes.bool,
  garage:      PropTypes.object
}

export default garagePlaceTooltip
