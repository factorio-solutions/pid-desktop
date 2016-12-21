import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import update                          from 'react-addons-update'
import moment                          from 'moment'

import Table       from '../_shared/components/Table/Table'
import RoundButton from '../_shared/components/buttons/RoundButton'
import PageBase    from '../_shared/containers/pageBase/PageBase'

import * as accountActions from '../_shared/actions/accounts.actions'
import { t }               from '../_shared/modules/localization/localization'
import * as nav            from '../_shared/helpers/navigation'

import styles                          from './accounts.page.scss'


export class AccountsPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount () {
    this.props.actions.initAccounts()
  }

  render() {
    const { state } = this.props

    const schema = [ { key: 'name',        title: t(['accounts','name']),  comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' }
                   , { key: 'id',          title: t(['accounts','id']),    comparator: 'number', }
                   , { key: 'user_count',  title: t(['accounts','users']), comparator: 'number', }
                   ]

    const addAccount    = () => { nav.to('/accounts/newAccount') }

    const addSpoiler = (account, index)=>{
      const toAccount     = () => { nav.to(`/accounts/${account.id}/users`) }
      const toEditAccount = () => { nav.to(`/accounts/${account.id}/edit`) }

      var spoiler = <span className={styles.floatRight}>
                      <RoundButton content={<span className='fa fa-pencil' aria-hidden="true"></span>} onClick={toEditAccount} type='action' state={account.can_manage ? "" : "disabled" }/>
                      <RoundButton content={<span className='fa fa-child' aria-hidden="true"></span>} onClick={toAccount} type='action'/>
                    </span>
      return update(account, {spoiler:{$set: spoiler}})
    }

    const content = <div>
                      <Table schema={schema} data={state.accounts.map(addSpoiler)}/>
                      <div className={styles.addButton}>
                        <RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>} onClick={addAccount} type='action' size='big'/>
                      </div>
                    </div>

    return (
      <PageBase content={content} />
    )
  }
}

export default connect(
  state    => ({ state: state.accounts }),
  dispatch => ({ actions: bindActionCreators(accountActions, dispatch) })
)(AccountsPage)
