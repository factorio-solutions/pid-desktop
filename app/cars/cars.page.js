import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import update                          from 'react-addons-update'
import moment                          from 'moment'

import Table       from '../_shared/components/Table/Table'
import RoundButton from '../_shared/components/buttons/RoundButton'
import PageBase    from '../_shared/containers/pageBase/PageBase'

import * as carActions  from '../_shared/actions/cars.actions'
import { t }            from '../_shared/modules/localization/localization'
import * as nav         from '../_shared/helpers/navigation'

import styles from './cars.page.scss'


export class CarsPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount () {
    this.props.actions.initCars()
  }

  render() {
    const { state, actions } = this.props

    const schema = [ { key: 'licence_plate', title: t(['cars','licencePlate']), comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' }
                   , { key: 'model',         title: t(['cars','model']),        comparator: 'string', }
                   , { key: 'color',         title: t(['cars','color']),        comparator: 'string', }
                   ]

    const addCar    = () => { nav.to('/cars/newCar') }

    const addSpoiler = (car, index)=>{
      const toCar      = () => { nav.to(`/cars/${car.id}/users`) }
      const toEditCar  = () => { nav.to(`/cars/${car.id}/edit`) }
      const destroyCar = () => { actions.destroyCar(car.id) }

      var spoiler = <span className={styles.floatRight}>
                      <RoundButton content={<span className='fa fa-pencil' aria-hidden="true"></span>} onClick={toEditCar} type='action' state={car.admin ? "" : "disabled" }/>
                      <RoundButton content={<span className='fa fa-child' aria-hidden="true"></span>} onClick={toCar} type='action'/>
                      {car.admin && <RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={destroyCar} type='remove' question={t(['cars','destroyCar'])}/>}
                    </span>
      return update(car, {spoiler:{$set: spoiler}})
    }

    const content = <div>
                      <Table schema={schema} data={state.cars.map(addSpoiler)}/>
                      <div className={styles.addButton}>
                        <RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>} onClick={addCar} type='action' size='big'/>
                      </div>
                    </div>

    return (
      <PageBase content={content} />
    )
  }
}

export default connect(
  state    => ({ state: state.cars }),
  dispatch => ({ actions: bindActionCreators(carActions, dispatch) })
)(CarsPage)
