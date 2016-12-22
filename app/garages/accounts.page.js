import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'
import * as nav                        from '../_shared/helpers/navigation'
import { t }                           from '../_shared/modules/localization/localization'

import styles from './accounts.page.scss'

import PageBase     from '../_shared/containers/pageBase/PageBase'
import Table        from '../_shared/components/Table/Table'
import RoundButton  from '../_shared/components/buttons/RoundButton'
import GarageLayout from '../_shared/components/GarageLayout/GarageLayout'
import DateInput    from '../_shared/components/input/DateInput'

import * as accountPlaceActions from '../_shared/actions/garageAccounts.actions'


export class GarageAccountsPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount () {
    this.props.actions.initAccounts(this.props.params.id)
  }

  componentWillUnmount () {
    this.props.actions.resetForm()
  }

  render() {
    const { state, actions } = this.props

    const schema = [ { key: 'name',         title: t(['garageUsers','selectAccount']),  comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' }
                   , { key: 'place_count',  title: t(['garages','places']),             comparator: 'number' }
                   ]

    const handleFloorChange = (index) => {
      actions.setFloor(index)
      actions.preparePlaces()
    }

    const handlePlaceClick = (place) => {
      actions.createConnection(place)
    }

    const prepateLabels = (floor) => {
      return floor.label
    }

    const data = state.accounts.map(function (account){
      return account
    })

    const accountClick = (account, index) => {
      account ? actions.setAccount(account.id) : actions.setAccount(undefined)
    }

    const onBack = () => {
      nav.to('/garages')
    }

    const handleFrom = (value) => {actions.setFrom(value)}
    const handleTo   = (value) => {actions.setTo(value)}

    const content = <div>
                      <div className={styles.parent}>

                        <div className={styles.leftCollumn}>
                          <div className={styles.padding}>
                            <div className={styles.datepicker}>
                              <DateInput onChange={handleFrom} label={t(['garageUsers', 'begins'])} error={t(['garageUsers', 'invalidaDate'])} value={state.from} />
                              <DateInput onChange={handleTo} label={t(['garageUsers', 'ends'])} error={t(['garageUsers', 'invalidaDate'])} value={state.to} showInf={true}/>
                            </div>
                            <Table schema={schema} data={data} onRowSelect={accountClick}/>
                          </div>
                          <div className={styles.backButtonContainer}><RoundButton content={<span className="fa fa-chevron-left" aria-hidden="true"></span>} onClick={onBack}/></div>
                        </div>
                        <div className={styles.rightCollumn}>
                        {state.account_id==undefined? "":
                        <GarageLayout
                          svg={state.selectedFloor!=null ? state.garage.floors[state.selectedFloor].scheme : "<svg></svg>"}
                          floors={state.garage.floors.map(prepateLabels)}
                          onFloorClick={handleFloorChange}
                          onPlaceClick={handlePlaceClick}
                          activeFloor={state.selectedFloor}
                          activePlaces = {state.availableFloors[state.selectedFloor].account_places_interval}
                          availableFloorsPlaces={state.availableFloors}
                          reservations={state.reservations}
                        />
                        }
                        </div>
                      </div>
                    </div>

    return (
      <PageBase content={content} />
    );
  }
}

export default connect(state => {
  const { garageAccounts } = state
  return ({
    state: garageAccounts
  })
}, dispatch => ({
  actions: bindActionCreators(accountPlaceActions, dispatch)
}))(GarageAccountsPage)
