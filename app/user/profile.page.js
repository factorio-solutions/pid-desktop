import React, { Component, PropTypes } from 'react'
import { request }                     from '../_shared/helpers/request'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import update                          from 'react-addons-update'
import moment                          from 'moment'

import PageBase            from '../_shared/containers/pageBase/PageBase'
import Localization        from '../_shared/components/localization/Localization'
import PatternInput        from '../_shared/components/input/PatternInput'
import Form                from '../_shared/components/form/Form'
import Table               from '../_shared/components/table/Table'
import RoundButton         from '../_shared/components/buttons/RoundButton'
import CallToActionButton  from '../_shared/components/buttons/CallToActionButton'

import * as nav            from '../_shared/helpers/navigation'
import { t }               from '../_shared/modules/localization/localization'
import * as profileActions from '../_shared/actions/profile.actions'
import { setCustomModal }  from '../_shared/actions/pageBase.actions'

import styles from './profile.page.scss'


export class SettingsPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    pageBase:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount(){
    this.props.actions.initUser()
  }

  render() {
    const {state, pageBase, actions} = this.props

    const submitForm = () => {
      checkSubmitable() && actions.submitUser()
    }

    const checkSubmitable = () => {
      return state.name.valid && state.phone.valid // && state.email.valid
    }

    const schema = [ { key: 'licence_plate', title: t(['cars','licencePlate']), comparator: 'string', representer: o => <strong>{o}</strong>, sort: 'asc' }
                   , { key: 'model',         title: t(['cars','model']),        comparator: 'string', }
                   , { key: 'color',         title: t(['cars','color']),        comparator: 'string', }
                   ]

    const addCar    = () => { nav.to('/profile/cars/newCar') }

    const addSpoiler = (car, index)=>{
      const toCar      = () => { nav.to(`/profile/cars/${car.id}/users`) }
      const toEditCar  = () => { nav.to(`/profile/cars/${car.id}/edit`) }
      const destroyCar = () => { actions.destroyCar(car.id) }

      var spoiler = <span className={styles.floatRight}>
                      <RoundButton content={<span className='fa fa-pencil' aria-hidden="true"></span>} onClick={toEditCar} type='action' state={car.admin ? "" : "disabled" }/>
                      <RoundButton content={<span className='fa fa-child' aria-hidden="true"></span>} onClick={toCar} type='action'/>
                      {car.admin && <RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={destroyCar} type='remove' question={t(['cars','destroyCar'])}/>}
                    </span>
      return update(car, {spoiler:{$set: spoiler}})
    }

    const emailSentModal =  <div style={{"textAlign": "center"}}>
                              { t(['profile', 'emailSent']) } <br/>
                              <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={()=> {actions.setCustomModal()}} type='confirm'  />
                            </div>

    return (
      <PageBase>
        <div>
          <h2>{t(['profile', 'profileSettings'])}</h2>
          <div>
            <label>{t(['profile', 'email'])}</label>
            {pageBase.current_user && pageBase.current_user.email}
          </div>
          <div>
            <label>{t(['profile', 'createdAt'])}</label>
            {pageBase.current_user && moment(pageBase.current_user.created_at).format("D. M. YYYY H:mm")}
          </div>
          <Form onSubmit={submitForm} submitable={checkSubmitable()}>
            <PatternInput onEnter={submitForm} onChange={actions.setName}  label={t(['signup_page', 'name'])}  error={t(['signup_page', 'nameInvalid'])}  pattern="^(?!\s*$).+"                 value={state.name.value} />
            <PatternInput onEnter={submitForm} onChange={actions.setPhone} label={t(['signup_page', 'phone'])} error={t(['signup_page', 'phoneInvalid'])} pattern="\+?\(?\d{2,4}\)?[\d\s-]{3,}" value={state.phone.value} />
          </Form>

          <div>
            <CallToActionButton label={t(['profile', 'resetPassword'])} onClick={() => {actions.changePassword(emailSentModal)}} />
          </div>
          <div>
            {t(['profile', 'hints'])} <input type="checkbox" checked={pageBase.current_user && pageBase.current_user.hint || false} onChange={actions.changeHints}/>
          </div>

          <div>
            {t(['profile', 'language'])}
            <Localization />
          </div>
        </div>
        <div>
          <h2>{t(['profile', 'cars'])}</h2>
          <div>
            <Table schema={schema} data={state.cars.map(addSpoiler)}/>
            <div className={styles.addButton}>
              <RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>} onClick={addCar} type='action' size='big'/>
            </div>
          </div>
        </div>
      </PageBase>
    );
  }
}

export default connect(
  state    => ({ state: state.profile, pageBase: state.pageBase  }),
  dispatch => ({ actions: bindActionCreators({...profileActions, setCustomModal}, dispatch) })
)(SettingsPage)
