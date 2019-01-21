import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import update                          from 'immutability-helper'

import Table              from '../../../_shared/components/table/Table'
import RoundButton        from '../../../_shared/components/buttons/RoundButton'
import LabeledRoundButton from '../../../_shared/components/buttons/LabeledRoundButton'

import * as nav                 from '../../../_shared/helpers/navigation'
import { t }                    from '../../../_shared/modules/localization/localization'
import * as financeActions      from '../../../_shared/actions/admin.finance.actions'

import styles from '../finance.page.scss'


class RentsTab extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initRents()
  }


  componentWillReceiveProps(nextProps) { // load garage if id changed
    if (nextProps.pageBase.garage !== this.props.pageBase.garage) {
      this.props.actions.initRents()
    }
  }

  newRentClick = () => nav.to(`/${this.props.pageBase.garage}/admin/finance/newRent`)

  editRent = id => nav.to(`/${this.props.pageBase.garage}/admin/finance/${id}/editRent`)


  prepareRent = rent => {
    const spoiler = (<div>
      <span className={styles.floatRight}>
        <LabeledRoundButton label={t([ 'garages', 'editRent' ])} content={<span className="fa fa-pencil" aria-hidden="true" />} onClick={() => this.editRent(rent.id)} type="action" />
      </span>
    </div>)

    return update(rent, { spoiler: { $set: spoiler }, price: { $set: `${Math.round(rent.price * 10) / 10} ${rent.currency.symbol}` }, place_count: { $set: rent.place_count + '' } })
  }

  render() {
    const { state } = this.props

    return (
      <div>
        <Table
          schema={[
            { key: 'name', title: t([ 'garages', 'rentName' ]), comparator: 'string', sort: 'asc' },
            { key: 'price', title: t([ 'garages', 'price' ]), comparator: 'string' },
            { key: 'place_count', title: t([ 'garages', 'places' ]), comparator: 'string' }
          ]}
          data={state.rents.map(this.prepareRent)}
        />
        <div className={styles.centerDiv}>
          <RoundButton content={<span className="fa fa-plus" aria-hidden="true" />} onClick={this.newRentClick} type="action" size="big" />
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({ state: state.adminFinance, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(financeActions, dispatch) })
)(RentsTab)
