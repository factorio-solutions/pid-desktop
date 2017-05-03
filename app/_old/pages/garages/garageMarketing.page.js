import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase     from '../_shared/containers/pageBase/PageBase'
import Table        from '../_shared/components/table/Table'
import RoundButton  from '../_shared/components/buttons/RoundButton'

import * as marketingActions  from '../_shared/actions/garageMarketing.actions'
import * as nav               from '../_shared/helpers/navigation'
import { t }                  from '../_shared/modules/localization/localization'

import styles from './garageMarketing.page.scss'


export class GarageMarketingPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initMarketing(this.props.params.id)
  }

  render() {
    const { state, actions } = this.props

    const schema = [ { key: 'id',                 title: t(['garageMarketing', 'id']),          comparator: 'number',   representer: o => <strong> {o} </strong>, sort: 'asc' }
                   , { key: 'email',              title: t(['garageMarketing', 'email']),       comparator: 'string' }
                   , { key: 'marketing_launched', title: t(['garageMarketing', 'status']),      comparator: 'boolean',  representer: o => o ? t(['garageMarketing', 'active']) : t(['garageMarketing', 'notActive']) }
                   , { key: 'phone',              title: t(['garageMarketing', 'phone']),       comparator: 'string' }
                   , { key: 'short_name',         title: t(['garageMarketing', 'short_name']),  comparator: 'string' }
                   ]

    const newMarketingClick = () => {
      nav.to(`/garages/${this.props.params.id}/marketing/newMarketing`)
    }

    const onBack = () => {
      nav.to(`/garages`)
    }

    const addSpoiler = (marketing) => {
      marketing['spoiler'] =  <div>
                                {`${marketing.short_name}.park-it-direct.com`} <br/>
                                {marketing.marketing_launched? t(['garageMarketing', 'marketingRuning']) : t(['garageMarketing', 'marketingStopped'])}
                                <span className={styles.floatRight}>
                                  <RoundButton content={<span className='fa fa-play' aria-hidden="true"></span>}    onClick={()=>{actions.runMarketing(marketing.id)}}                                        type='action'                                                   state={marketing.marketing_launched && 'disabled'}/>
                                  <RoundButton content={<span className='fa fa-pencil' aria-hidden="true"></span>}  onClick={()=>{nav.to(`/garages/${this.props.params.id}/marketing/${marketing.id}/edit`)}} type='action' />
                                  <RoundButton content={<span className='fa fa-pause' aria-hidden="true"></span>}   onClick={()=>{actions.stopMarketing(marketing.id)}}                                       type='remove' question={t(['garageMarketing','stopMarketing'])} state={!marketing.marketing_launched && 'disabled'}/>
                                  <RoundButton content={<span className='fa fa-play' aria-hidden="true"></span>}    onClick={()=>{ window.open('#/'+nav.path(`/marketing/${marketing.short_name}`))}}                              type='remove' question='Go to page? '/>
                                </span>
                              </div>
      return marketing
    }

    const content = <div>
                      <Table schema={schema} data={state.marketing.map(addSpoiler)} />
                      <div className={styles.centerDiv}>
                        <div style={{float: "left"}}>
                          <RoundButton content={<span className='fa fa-chevron-left' aria-hidden="true"></span>} onClick={onBack} />
                        </div>
                        <RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>} onClick={newMarketingClick} type='action' size='big' />
                      </div>
                    </div>

    return (
      <PageBase content={content} />
    )
  }
}

export default connect(
  state    => ({ state: state.garageMarketing }),
  dispatch => ({ actions: bindActionCreators(marketingActions, dispatch) })
)(GarageMarketingPage)
