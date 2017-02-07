import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import update                          from 'react-addons-update'
import moment                          from 'moment'

import Table       from '../_shared/components/table/Table'
import RoundButton from '../_shared/components/buttons/RoundButton'
import PageBase    from '../_shared/containers/pageBase/PageBase'

import * as clientActions  from '../_shared/actions/clients.actions'
import { t }               from '../_shared/modules/localization/localization'
import * as nav            from '../_shared/helpers/navigation'

import styles                          from './clients.page.scss'


export class ClientsPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount () {
    this.props.actions.initClients()
  }

  render() {
    const { state } = this.props

    const schema = [ { key: 'name',        title: t(['clients','name']),  comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' }
                   , { key: 'id',          title: t(['clients','id']),    comparator: 'number', }
                   , { key: 'user_count',  title: t(['clients','users']), comparator: 'number', }
                   ]

    const addClient    = () => { nav.to('/clients/newClient') }

    const addSpoiler = (client, index)=>{
      const toClient     = () => { nav.to(`/clients/${client.id}/users`) }
      const toEditClient = () => { nav.to(`/clients/${client.id}/edit`) }

      var spoiler = <span className={styles.floatRight}>
                      <RoundButton content={<span className='fa fa-pencil' aria-hidden="true"></span>} onClick={toEditClient} type='action' state={client.admin ? "" : "disabled" }/>
                      <RoundButton content={<span className='fa fa-child' aria-hidden="true"></span>} onClick={toClient} type='action'/>
                    </span>
      return update(client, {spoiler:{$set: spoiler}})
    }

    const content = <div>
                      <Table schema={schema} data={state.clients.map(addSpoiler)}/>
                      <div className={styles.addButton}>
                        <RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>} onClick={addClient} type='action' size='big'/>
                      </div>
                    </div>

    return (
      <PageBase content={content} />
    )
  }
}

export default connect(
  state    => ({ state: state.clients }),
  dispatch => ({ actions: bindActionCreators(clientActions, dispatch) })
)(ClientsPage)
