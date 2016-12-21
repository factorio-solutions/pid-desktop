import React, { Component, PropTypes } from 'react'
import { bindActionCreators }          from 'redux'
import { connect }                     from 'react-redux'
import * as onsen                      from 'react-onsenui' // important - handles mobile layouy

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
    actions:    PropTypes.object,
    state:      PropTypes.object,
    // header looks
    hide:       PropTypes.bool,
    hideHeader: PropTypes.bool,
    label:      PropTypes.string,
    margin:     PropTypes.bool,
    // navigation functions - if undefined, button is hidden
    back:       PropTypes.func,
    add:        PropTypes.func,
    ok:         PropTypes.func,
    remove:     PropTypes.func
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  constructor(props) {
     super(props);
     this.state = {showMenu: false}
  }

  componentDidMount(){
    const { actions, hide, hideHeader } = this.props
    !hideHeader && !hide && actions.initGarages()
  }

  render() {
    const { actions, state, hide, hideHeader, label, margin, back, add, ok, remove } = this.props

    const garageContent = () => {
      const garageSelected = (index) => {
        actions.setGarage(state.garages[index].id)
      }

      return state.garages.map(function(garage, index){
        return { label: garage.name, onClick: garageSelected.bind(this, index) }
      })
    }

    const selectedGarage = () => {
      return state.garages.findIndex(function(garage){return garage.id == state.garage_id})
    }

    const hideMenu = () => {
      this.setState({showMenu: false})
    }

    const toggleMenu = () => {
      this.setState({showMenu: !this.state.showMenu})
    }

    const logOut = () => {
      delete localStorage["jwt"]
      delete localStorage["store"]
      // actions.resetStore()
      this.context.router.push('/login')
    }

    const currentUser = () => {
      console.log('TODO: current user profile');
    }

    const divider = <div className={styles.divider}><div className={styles.line}> </div></div>

    const currentUserInfo = state.current_user && <div className={styles.currentUserInfo}> {/* currently singned in user information */}
                              <div className={styles.buttonContainer}>
                                <RoundButton content={<span className='fa fa-user' aria-hidden="true"></span>} onClick={currentUser} type='action'/>
                              </div>
                              <div>
                                <b>{ state.current_user.full_name }</b> <br/>
                                { state.current_user.email } <br/>
                                { state.current_user.phone && state.current_user.phone }
                              </div>
                            </div>

    const sideMenuContent = <div>
                              {state.current_user ? currentUserInfo : <div>User info unavailable.</div>}
                              {divider}
                              <ButtonStack divider={divider}>
                                {[<MenuButton key='1' icon="sign-out" label="log out" onClick={logOut} state={!state.online && 'disabled'} />]}
                              </ButtonStack>
                            </div>

    const renderHeader = () => {
      return (
        <div className={styles.header}>
          <div className={styles.logo}>
            <Logo />
          </div>

          <div className={styles.content}>
            <div>
              <div><b>{label}</b></div>
              {!hide && <div><Dropdown label="Select garage" content={garageContent()} style='dark' selected={selectedGarage()}/></div>}
            </div>
          </div>

          <button onClick={toggleMenu} className={styles.menuButton}> <i className="fa fa-bars" aria-hidden="true"></i> </button>
          <MobileSlideMenu content={sideMenuContent} show={this.state.showMenu} dimmerClick={hideMenu}/>

        </div>
      )
    }

    return(
      <div className={margin && styles.app_page}>

        <div className={!hideHeader && styles.pageContent}>
          {this.props.children}
        </div>

        {back && <div className={styles.backButton}><RoundButton content={<span className='fa fa-chevron-left' aria-hidden="true"></span>} onClick={back}/></div>}
        {add && <div className={styles.addButton}><RoundButton content={<span className='fa fa-plus' aria-hidden="true"></span>} onClick={add} type='action' state={!state.online && 'disabled'}/></div>}
        {ok && <div className={styles.okButton}><RoundButton content={<span className='fa fa-check' aria-hidden="true"></span>} onClick={ok} type='confirm' state={!state.online && 'disabled'}/></div>}
        {remove && <div className={styles.okButton}><RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={remove} type='remove' state={!state.online && 'disabled'}/></div>}

        {!hideHeader && renderHeader()}
      </div>
    )
  }
}

export default connect(state => {
  const { mobileHeader } = state
  return ({
    state: mobileHeader
  })
}, dispatch => ({
  actions: bindActionCreators(headerActions, dispatch)
}))(Page)
