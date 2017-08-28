import moment from 'moment'

import { t }                                 from '../modules/localization/localization'
import { request }                           from '../helpers/request'
import { MOMENT_DATETIME_FORMAT, timeToUTC } from '../helpers/time'

import { formatDate, dateToMoment } from './analytics.garage.actions'

import { PLACES_TURNOVER }          from '../queries/analytics.places.queries'


export const ANALYTICS_PLACES_SET_GARAGE  = 'ANALYTICS_PLACES_SET_GARAGE'
export const ANALYTICS_PLACES_SET_FROM    = 'ANALYTICS_PLACES_SET_FROM'
export const ANALYTICS_PLACES_SET_TO      = 'ANALYTICS_PLACES_SET_TO'
export const ANALYTICS_PLACES_SET_DISPLAY = 'ANALYTICS_PLACES_SET_DISPLAY'
export const ANALYTICS_PLACES_SET_LOADING = 'ANALYTICS_PLACES_SET_LOADING'


export function setGarage(value){
  return { type: ANALYTICS_PLACES_SET_GARAGE
         , value
         }
}

export function setFrom(value){
  return (dispatch, getState) => {
    dispatch({ type: ANALYTICS_PLACES_SET_FROM
             , value
             })
    dispatch(initPlacesAnalytics())
  }
}

export function setTo(value){
  return (dispatch, getState) => {
    dispatch({ type: ANALYTICS_PLACES_SET_TO
             , value
             })
    dispatch(initPlacesAnalytics())
  }
}

export function setDisplay(value){
  return { type: ANALYTICS_PLACES_SET_DISPLAY
         , value
         }
}

export function setLoading(value){
  return { type: ANALYTICS_PLACES_SET_LOADING
         , value
         }
}


export function graphClick() {
  return (dispatch, getState) => {
    dispatch(setDisplay('graph'))
  }
}

export function heatmapClick() {
  return (dispatch, getState) => {
    dispatch(setDisplay('heatmap'))
  }
}

export function initPlacesAnalytics() {
  return (dispatch, getState) => {
    dispatch(setLoading(true))
    const state = getState().analyticsPlaces

    let momentFrom = dateToMoment(state.from)
    let momentTo = dateToMoment(state.to)
    if (momentFrom.isValid() && momentTo.isValid()){ // dont donwload if dates are invalid
      const onSuccess = (response) => {
        response.data.garage.floors.forEach(floor => { // find prices for palces
          floor.places = floor.places.map((place) => {
            const newContractsTurnover = place.contracts_turnover.map(contract => { // calculate price for whole interval
                                           let contractFrom = moment(contract.from) // original values
                                           let contractTo   = moment(contract.to)
                                           if (contractFrom.isBefore(momentFrom)) contractFrom = momentFrom // cut to selected interval
                                           if (contractTo.isAfter(momentTo))      contractTo   = momentTo

                                           let currentDate = contractFrom.clone().startOf('month') // holder of current month of iteration
                                             , prices = [] // prices accumulator
                                           while (currentDate.isBefore(contractTo)) { // calculate prices for all selected months
                                             const from = currentDate.isBefore(contractFrom) ? contractFrom : currentDate
                                             const to   = currentDate.clone().endOf('month').isAfter(contractTo) ? contractTo : currentDate.clone().endOf('month')
                                             prices.push(Math.round(contract.rent.price * to.diff(from, 'months', true)))
                                             currentDate.add(1, 'month')
                                           }

                                           return { ...contract
                                                  , pricesInInterval: prices
                                                  }
                                         })
            return { ...place
                   , contracts_turnover: newContractsTurnover
                   , averageRevenue: Math.round((place.reservations_turnover.reduce((acc, reservation)=> {
                                       return acc+reservation.price
                                     }, 0) +
                                     newContractsTurnover.reduce((acc, contract) => {
                                       return acc + contract.pricesInInterval.reduce((a,b) => a+b, 0)
                                     }, 0)) / Math.round(momentTo.diff(momentFrom, 'months', true)))
                   , minRevenue: Math.min(...[...place.reservations_turnover.map(reservation => reservation.price), ...newContractsTurnover.reduce((acc, contract) => [...acc, ...contract.pricesInInterval], [])])
                   , maxRevenue: Math.max(...[...place.reservations_turnover.map(reservation => reservation.price), ...newContractsTurnover.reduce((acc, contract) => [...acc, ...contract.pricesInInterval], [])])
                   , currency:   place.reservations_turnover[0] ? place.reservations_turnover[0].currency : place.contracts_turnover[0] ? place.contracts_turnover[0].rent.currency : ''
                   }
          })
        })

        let currentDate = momentFrom.clone().startOf('month') // holder of current month of iteration
          , statistics = []
        while (currentDate.isBefore(momentTo) && currentDate.isBefore(moment(state.to, 'DD. MM. YYYY'))) { // calculate prices for all selected months

          const reservationsOfInterval = response.data.garage.floors.reduce((acc,floor) => {
            return floor.places.reduce((acc, place) => {
              return [...acc, ...place.reservations_turnover.filter((reservation) => {
                return moment(reservation.created_at).isBetween(currentDate, currentDate.clone().endOf('month'))
              })]
            }, acc)
          }, [])

          const contractsOfInterval = response.data.garage.floors.reduce((acc,floor) => {
            return floor.places.reduce((acc, place) => {
              return [...acc, ...place.contracts_turnover.filter((contract) => {
                return moment(contract.from).isBetween(currentDate, currentDate.clone().endOf('month')) ||
                       moment(contract.to).isBetween(currentDate, currentDate.clone().endOf('month'))   ||
                       ( moment(contract.from).isBefore(currentDate) && moment(contract.to).isAfter(currentDate.clone().endOf('month')) )
              })]
            }, acc)
          }, []).map(contract => {
            let contractFrom = moment(contract.from)
            let contractTo   = moment(contract.to)
            if (contractFrom.isBefore(currentDate))                     contractFrom = currentDate // cut to selected interval
            if (contractTo.isAfter(currentDate.clone().endOf('month'))) contractTo   = currentDate.clone().endOf('month')

            return { ...contract
                   , price: Math.round(contract.rent.price * contractTo.diff(contractFrom, 'month', true))
                   }
          })

          const placeCount        = response.data.garage.floors.reduce((acc, floor) => acc + floor.places.length, 0)
          const shorttermTurnover = reservationsOfInterval.reduce((acc, res) => {return acc + res.price}, 0)
          const longtermTurnover  = contractsOfInterval.reduce((acc, contr) => {return acc + contr.price}, 0)

          statistics.push({ date:      currentDate.format('M/YYYY')
                          , shortterm: { turnover:    shorttermTurnover
                                       , avgTurnover: Math.round(shorttermTurnover/placeCount)
                                       , minRevenue:  Math.min(...reservationsOfInterval.map(res => res.price))
                                       , maxRevenue:  Math.max(...reservationsOfInterval.map(res => res.price))
                                       , currency:    reservationsOfInterval.length ? reservationsOfInterval[0].currency.symbol : ''
                                       }
                          , longterm:  { turnover:    longtermTurnover
                                       , avgTurnover: Math.round(longtermTurnover/placeCount)
                                       , minRevenue:  Math.min(...contractsOfInterval.map(contr => contr.price))
                                       , maxRevenue:  Math.max(...contractsOfInterval.map(contr => contr.price))
                                       , currency:    contractsOfInterval.length ? contractsOfInterval[0].rent.currency.symbol : ''
                                       }
                          })
          currentDate.add(1, 'month')
        }

        dispatch(setGarage({ ...response.data.garage
                           , statistics
                           }))
        dispatch(setLoading(false))
      }

      getState().pageBase.garage && request(onSuccess, PLACES_TURNOVER, { from: timeToUTC(momentFrom.format(MOMENT_DATETIME_FORMAT))
                                                                        , to: timeToUTC(momentTo.endOf('month').format(MOMENT_DATETIME_FORMAT))
                                                                        , id: getState().pageBase.garage
                                                                        })
    }
  }
}

export function currency () {
  return (dispatch, getState) => {
    const state = getState().analyticsPlaces
    const statisticWithCurrency = state.garage && state.garage.statistics.find((stat) => {
      return stat.longterm.currency !== '' || stat.shortterm.currency !== ''
    })

    return statisticWithCurrency !== undefined ? statisticWithCurrency.shortterm.currency === '' ? statisticWithCurrency.longterm.currency : statisticWithCurrency.shortterm.currency : ""
  }
}
