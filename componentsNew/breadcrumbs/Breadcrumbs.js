import React    from 'react'
import * as nav from '../../helpers/navigation'

import BreadcrumbsButton from '../buttons/BreadcrumbsButton'

import styles from './Breadcrumbs.scss'


export default function Breadcrumbs ()  {

  const contains = text => window.location.hash.indexOf(text) != -1

  // switch (true) { // fill path here
  //   case expression:
  //
  //     break;
  //   default:
  // }

  const path = [{label: 'reservations', route: '/reservations'}, {label: 'some', route: '/releaseNotes'}]

  const createButtons = (accumulator, object, index, arr) => {
    if (arr.length-1 === index){
      accumulator.push(<BreadcrumbsButton content={object.label} state='selected'/>)
    } else {
      accumulator.push(<BreadcrumbsButton content={object.label} onClick={() => { nav.to(object.route) }}/>)
      accumulator.push(<BreadcrumbsButton content={'>'} state='disabled'/>)
    }

    return accumulator
  }

  return (<div className={styles.breadcrumbs}>
            {path.reduce(createButtons, [])}
          </div>)
}
