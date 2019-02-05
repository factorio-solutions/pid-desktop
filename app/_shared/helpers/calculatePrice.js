// helper calculatePrice will calculate price from pricing

// import { calculatePrice }  from '../_shared/helpers/calculatePrice'
//
// let price = calculatePrice(pricing, from, to)
// pricing = { flat_price:              Integer || null(unless exponential_prices are null)
//           , exponential_month_price: Integer || null(unless flat_price is null)
//           , exponential_week_price:  Integer || null(unless flat_price is null)
//           , exponential_day_price:   Integer || null(unless flat_price is null)
//           , exponential_12h_price:   Integer || null(unless flat_price is null)
//           , weekend_price:           Integer || null
//           }
// from = time in moment.js format
// to = time in moment.js format

import { getLanguage } from '../modules/localization/localization'

export function convertPriceToString(price) {
  if (price == undefined) return undefined

  return price.toLocaleString(getLanguage(), { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function valueAddedTax(price, vat = 0) {
  return convertPriceToString(price * (1 + vat))
}

export function calculateDuration(from, to) {
  return to.diff(from) / (1000 * 60 * 60)
}

export function calculatePrice(pricing, from, to, vat = 0) {
  const duration = calculateDuration(from, to)
  const dates = [ from ]
  while (dates[dates.length - 1].clone().add(1, 'day').startOf('day').isBefore(to)) {
    dates.push(dates[dates.length - 1].clone().add(1, 'day').startOf('day'))
  }

  return valueAddedTax(dates.reduce((sum, date, index, arr) => {
    let price = pricing.flat_price
    if (pricing.exponential_month_price !== null) price = pricing.exponential_month_price
    if (pricing.exponential_week_price !== null && duration <= 168) price = pricing.exponential_week_price
    if (pricing.exponential_day_price !== null && duration <= 24) price = pricing.exponential_day_price
    if (pricing.exponential_12h_price !== null && duration <= 12) price = pricing.exponential_12h_price
    if (pricing.weekend_price !== null && (date.isoWeekday() === 6 || date.isoWeekday() === 7)) price = pricing.weekend_price

    return sum + (((arr[index + 1] || to).diff(date) / (1000 * 60 * 60)) * price) // sum + hoursBetweenDates * hourPrice (1000*60*60 = hour)
  }, 0), vat)
}
