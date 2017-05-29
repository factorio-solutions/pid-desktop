import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import update                          from 'react-addons-update'

import PageBase    from '../../_shared/containers/pageBase/PageBase'
import Table       from '../../_shared/components/table/Table'
import RoundButton from '../../_shared/components/buttons/RoundButton'

import * as nav                 from '../../_shared/helpers/navigation'
import { t }                    from '../../_shared/modules/localization/localization'
import * as financeActions      from '../../_shared/actions/admin.finance.actions'

import styles from './finance.page.scss'


export class FinancePage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount () {
    this.props.actions.initRents()
  }

  render() {
    const { state, pageBase, actions } = this.props
    const rentSchema = [ { key: 'name',         title: t(['garages','rentName']), comparator: 'string', sort: 'asc' }
                       , { key: 'price',        title: t(['garages','price']),    comparator: 'string' }
                       , { key: 'place_count',  title: t(['garages','places']),   comparator: 'string' }
                       ]

    const newRentClick = () => {nav.to(`/${pageBase.garage}/admin/finance/newRent`)}
    const editRent     = (id)  => { nav.to(`/${pageBase.garage}/admin/finance/${id}/editRent`) }


    const prepareRent = (rent, index) => {
      let spoiler = <div>
        <span className={styles.floatRight}>
          <RoundButton content={<span className='fa fa-pencil' aria-hidden="true"></span>} onClick={()=>{editRent(rent.id)}} type='action'/>
        </span>
      </div>

      return update(rent, {spoiler:{$set: spoiler}, price: {$set: `${rent.price} ${rent.currency.symbol}`}, place_count: {$set: rent.place_count+''}})
    }

    return (
      <PageBase>
      {pageBase.current_user && pageBase.current_user.garage_admin &&
        <div>
          <h2>{t(['garages','placeRent'])}</h2>
          <Table schema={rentSchema} data={state.rents.map(prepareRent)} />
          <div className={styles.centerDiv}>
            <RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>} onClick={newRentClick} type='action' size='big' />
          </div>
        </div>
      }
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.adminFinance, pageBase: state.pageBase  }), //{ state: state.dashboard }
  dispatch => ({ actions: bindActionCreators(financeActions, dispatch) }) //{ actions: bindActionCreators(dashboardActions, dispatch) }
)(FinancePage)
