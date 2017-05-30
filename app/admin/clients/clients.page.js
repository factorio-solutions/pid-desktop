import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import update                          from 'react-addons-update'
import moment                          from 'moment'

import Table       from '../../_shared/components/table/Table'
import RoundButton from '../../_shared/components/buttons/RoundButton'
import PageBase    from '../../_shared/containers/pageBase/PageBase'

import * as clientActions  from '../../_shared/actions/clients.actions'
import { setClient }       from '../../_shared/actions/newContract.actions'
import { t }               from '../../_shared/modules/localization/localization'
import * as nav            from '../../_shared/helpers/navigation'

import styles from './clients.page.scss'


export class ClientsPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount () {
    this.props.actions.initClients()
  }

  render() {
    const { actions, state, pageBase } = this.props
    console.log(pageBase);

    const schema = [ { key: 'name',        title: t(['clients','name']),  comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' }
                   , { key: 'token',       title: t(['clients','token']), comparator: 'string', }
                   , { key: 'id',          title: t(['clients','id']),    comparator: 'number', }
                   , { key: 'user_count',  title: t(['clients','users']), comparator: 'number', }
                   ]

    const addClient    = () => {nav.to(`/${pageBase.garage}/admin/clients/newClient`)}
    const addContract  = () => {nav.to(`/${pageBase.garage}/admin/clients/newContract`)}

    const addSpoiler = (client, index)=>{
      const toClient     = () => {nav.to(`/${pageBase.garage}/admin/clients/${client.id}/users`)}
      const toEditClient = () => {nav.to(`/${pageBase.garage}/admin/clients/${client.id}/edit`)}
      const toInvoices = () => { nav.to(`/clients/${client.id}/invoices`) }
      const toNewContract = () => { nav.to(`/${pageBase.garage}/admin/clients/newContract`)
        actions.setClient(client.id)
      }
      const prepareContractButton = (contract) =>{
        const onContractClick = () =>{ nav.to(`/${pageBase.garage}/admin/clients/${contract.id}/editContract`) }
        return <div className={styles.contract} onClick={onContractClick}>{contract.name}</div>
      }

      var spoiler = <div className={styles.spoiler}>
        <div>
          {client.contracts.map(prepareContractButton)}
        </div>
        <div>
          <RoundButton content={<span>+<span className='fa fa-file-text-o' aria-hidden="true"></span></span>} onClick={toNewContract} type='action' state={!pageBase.isGarageAdmin && 'disabled'}/>
          <RoundButton content={<span className='fa fa-pencil' aria-hidden="true"></span>} onClick={toEditClient} type='action' state={client.admin ? "" : "disabled" }/>
          <RoundButton content={<span className='fa fa-child' aria-hidden="true"></span>} onClick={toClient} type='action'/>
          {/*<RoundButton content={<span className='fa fa-file' aria-hidden="true"></span>} onClick={toInvoices} type='action' state={client.admin ? "" : "disabled" }/>*/}
        </div>
      </div>
      return update(client, {spoiler:{$set: spoiler}})
    }

    return (
      <PageBase>
        <div>
          <Table schema={schema} data={state.clients.map(addSpoiler)}/>
          <div className={styles.addButton}>
            <RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>} onClick={addClient} type='action' size='big'/>
            <RoundButton content={<span>+<span className='fa fa-file-text-o' aria-hidden="true"></span></span>} onClick={addContract} type='action' size='big'/>
          </div>
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.clients, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators({...clientActions, setClient}, dispatch) })
)(ClientsPage)
