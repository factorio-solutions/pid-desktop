import moment from 'moment'

import { t } from '../modules/localization/localization'


// will take the recurring rule and will make a sentence describing it
export default function describeRule(rule) {
  if (typeof rule === 'string') rule = JSON.parse(rule)

  const typely = rule.type === 'day' ? 'daily' : (rule.type + 'ly')

  return [
    `${t([ 'recurringReservation', 'repeat' ])} ${t([ 'recurringReservation', typely ])}`,
    rule.interval > 1 ? `${t([ 'recurringReservation', 'every' ])} ${rule.interval} ${t([ 'recurringReservation', rule.type ], { count: rule.interval })}` : '',
    rule.type === 'week' ? rule.day.map(day => moment().weekday(day).format('dddd')).join(', ') : '',
    `${rule.count} ${t([ 'recurringReservation', 'occurence' ], { count: rule.count })}`
  ].filter(s => s.length > 0).join(', ')
}
