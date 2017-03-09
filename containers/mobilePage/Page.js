import React, { Component, PropTypes } from 'react'
import { bindActionCreators }          from 'redux'
import { connect }                     from 'react-redux'
import * as onsen                      from 'react-onsenui' // important - handles mobile layout

import Logo            from '../../components/logo/Logo'
import Dropdown        from '../../components/dropdown/Dropdown'
import RoundButton     from '../../components/buttons/RoundButton'
import MobileSlideMenu from '../../components/mobileSlideMenu/MobileSlideMenu'
import ButtonStack     from '../../components/buttonStack/ButtonStack'
import MenuButton      from '../../components/buttons/MenuButton'

import styles from './Page.scss'

import * as headerActions from '../../actions/mobile.header.actions'


export class Page extends Component {
  static propTypes = {
    actions:       PropTypes.object,
    state:         PropTypes.object,

    // header looks
    hideHeader:    PropTypes.bool,
    hideDropdown:  PropTypes.bool,
    hideHamburger: PropTypes.bool,
    label:         PropTypes.string, // header content
    margin:        PropTypes.bool, // will give page 10px margin to offset content

    // navigation functions
    back:          PropTypes.func,
    add:           PropTypes.func,
    ok:            PropTypes.func,
    remove:        PropTypes.func
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  componentDidMount(){
    const { actions, hideDropdown, hideHeader } = this.props
    !hideHeader && !hideDropdown && actions.initGarages()
  }

  render() {
    const { actions, state }                                         = this.props
    const { hideDropdown, hideHamburger, hideHeader, label, margin } = this.props
    const { back, add, ok, remove }                                  = this.props

    const selectedGarage = () => { return state.garages.findIndex(function(garage){return garage.id == state.garage_id}) }
    const toggleMenu     = () => { actions.toggleMenu() }
    const currentUser    = () => { console.log('TODO: current user profile') }
    const sideMenuItems  = [ <MenuButton key='1' icon="sign-out" label="log out" onClick={logOut} state={!state.online && 'disabled'} /> ]

    const garageContent = () => {
      const garageSelected = (index) => { actions.setGarage(state.garages[index].id) }
      return state.garages.map(function(garage, index){
        return { label: garage.name, onClick: garageSelected.bind(this, index) }
      })
    }

    const logOut = () => {
      this.context.router.push('/login')
      actions.logout()
    }


    const divider = <div className={styles.divider}><div className={styles.line}> </div></div>

    const header = <div className={styles.header}>
                     <div className={styles.logo}>
                       <Logo />
                     </div>
                     <div className={styles.content}>
                       <div><b>{label}</b></div>
                       { !hideDropdown && <div><Dropdown label="Select garage" content={garageContent()} style='dark' selected={selectedGarage()} fixed={true}/></div> }
                     </div>
                     { !hideHamburger && <button onClick={toggleMenu} className={styles.menuButton}> <i className="fa fa-bars" aria-hidden="true"></i> </button> }
                     <MobileSlideMenu content={sideMenuContent} show={state.showMenu} dimmerClick={toggleMenu}/>
                   </div>

    const currentUserInfo = state.current_user && <div className={styles.currentUserInfo}> {/* currently singned in user information */}
                               <div className={styles.buttonContainer}>
                                 <RoundButton content={<span className='fa fa-user' aria-hidden="true"></span>} onClick={currentUser} type='action'/>
                               </div>
                               <div>
                                 <div><b>{ state.current_user.full_name }</b></div>
                                 <div>{ state.current_user.email }</div>
                                 { state.current_user.phone && <div>{state.current_user.phone}</div> }
                               </div>
                             </div>

    const sideMenuContent = <div>
                              { state.current_user ? currentUserInfo : <div>User info unavailable.</div> }
                              { divider }
                              <ButtonStack divider={divider}>
                                { sideMenuItems }
                              </ButtonStack>
                            </div>


    return(
      <div className={margin && styles.app_page}>
        <div className={!hideHeader && styles.pageContent}>
          {this.props.children}
        </div>

        {back &&   <div className={styles.backButton}><RoundButton content={<span className='fa fa-chevron-left' aria-hidden="true"></span>} onClick={back}/></div>}
        {add &&    <div className={styles.addButton}> <RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>}         onClick={add}    type='action'  state={!state.online && 'disabled'}/></div>}
        {ok &&     <div className={styles.okButton}>  <RoundButton content={<span className='fa fa-check' aria-hidden="true"></span>}        onClick={ok}     type='confirm' state={!state.online && 'disabled'}/></div>}
        {remove && <div className={styles.okButton}>  <RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>}        onClick={remove} type='remove'  state={!state.online && 'disabled'}/></div>}

        {!hideHeader && header}
      </div>
    )
  }
}

export default connect(
  state    => ({ state: state.mobileHeader }),
  dispatch => ({ actions: bindActionCreators(headerActions, dispatch) })
)(Page)
