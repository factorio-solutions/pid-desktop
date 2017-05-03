import React    from 'react'
import * as nav from '../../helpers/navigation'

import BreadcrumbsButton from '../buttons/BreadcrumbsButton'

import styles from './Breadcrumbs.scss'


export default function Breadcrumbs ({path})  {

  const createButtons = (accumulator, object, index, arr) => {
    if (arr.length-1 === index){
      accumulator.push(<BreadcrumbsButton content={object.label} state='selected'/>)
    } else {
      accumulator.push(<BreadcrumbsButton content={object.label} onClick={() => { nav.to(object.route) }}/>)
      accumulator.push(<BreadcrumbsButton content={'>'} state='disabled'/>)
    }

    return accumulator
  }

  return ( <div className={styles.breadcrumbs}>
             {path.reduce(createButtons, [])}
          </div>
        )
}
