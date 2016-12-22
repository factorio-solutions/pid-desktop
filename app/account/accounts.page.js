import React, { Component, PropTypes } from 'react'
import moment                          from 'moment'
import styles                          from './accounts.page.scss'
import { t }                           from '../_shared/modules/localization/localization'
import * as nav                        from '../_shared/helpers/navigation'
import update                          from 'react-addons-update'

import Table       from '../_shared/components/Table/Table'
import RoundButton from '../_shared/components/buttons/RoundButton'
import PageBase    from '../_shared/containers/pageBase/PageBase'

import { initAccounts }                               from '../_shared/actions/accounts.actions'
import { setHoriontalContent, setHorizontalSelected } from '../_shared/actions/pageBase.actions'


export default class AccountsPage extends Component {
  static contextTypes = {
    store: PropTypes.object
  }

  componentDidMount () {
    const { store } = this.context
    this.unsubscribe = store.subscribe(() => { this.forceUpdate() })
    store.dispatch(initAccounts())
  }

  componentWillUnmount () {
    this.unsubscribe()
  }

  render() {
    const { store } = this.context
    const state = store.getState().accounts

    const schema = [ { key: 'name',        title: t(['accounts','from']),  comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' }
                   , { key: 'id',          title: t(['accounts','id']),    comparator: 'number', }
                   , { key: 'user_count',  title: t(['accounts','users']), comparator: 'number', }
                   ]

    const data = state.accounts.map(function (account){
      // TODO: add spoiler - information about admin?
      return account
    })

    const addAccount = () => {
      nav.to('/accounts/newAccount')
    }

    const addSpoiler = (account, index)=>{
      const toAccount = () => {
        nav.to(`/accounts/${account.id}/users`)
        store.dispatch(setHorizontalSelected(1))
      }

      const toEditAccount = () => {
        nav.to(`/accounts/${account.id}/edit`)
        store.dispatch(setHorizontalSelected(1))
      }

      var spoiler = <span className={styles.floatRight}>
                      <RoundButton content={<span className='fa fa-pencil' aria-hidden="true"></span>} onClick={toEditAccount} type='action' state={account.can_manage ? "" : "disabled" }/>
                      <RoundButton content={<span className='fa fa-child' aria-hidden="true"></span>} onClick={toAccount} type='action'/>
                    </span>

      return update(account, {spoiler:{$set: spoiler}})
    }

    // const AccountSeleted = (acc, index) => { // HACK: DO THIS BETTER !!!!
    //   if (acc == undefined){
    //     // Deselected
    //     store.dispatch(setHoriontalContent(
    //                     [ {content: t(['pageBase', 'Accounts']),  onClick: () => { nav.to('/accounts'); store.dispatch(setHorizontalSelected(0))}}
    //                     , {content: t(['pageBase', 'Users']), state:  'disabled' }
    //                     ]))
    //
    //   } else {
    //     // Selected
    //     store.dispatch(setHoriontalContent(
    //                     [ {content: t(['pageBase', 'Accounts']),  onClick: () => { nav.to('/accounts'); store.dispatch(setHorizontalSelected(0))}}
    //                     , {content: t(['pageBase', 'Users']), onClick: () => { nav.to(`/accounts/${acc.id}/users`); store.dispatch(setHorizontalSelected(1)) } }
    //                     ]))
    //   }
    // }

    const content = <div>
                      <Table schema={schema} data={data.map(addSpoiler)}/>
                      <div className={styles.addButton}>
                        <RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>} onClick={addAccount} type='action' size='big'/>
                      </div>
                    </div>
    return (
      <PageBase content={content} />
    );
  }
}
