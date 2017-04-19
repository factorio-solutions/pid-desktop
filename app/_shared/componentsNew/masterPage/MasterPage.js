import React, { Component, PropTypes }  from 'react'

import Logo                  from '../logo/Logo'
import CallToActionButton    from '../buttons/CallToActionButton'
import MenuButton            from '../buttons/MenuButton'
import GarageSelector        from '../garageSelector/GarageSelector'
import VerticalMenu          from '../verticalMenu/VerticalMenu'
import VerticalSecondaryMenu from '../verticalMenu/VerticalSecondaryMenu'
import Breadcrumbs           from '../breadcrumbs/Breadcrumbs'

import styles from './MasterPage.scss'


export default class MasterPage extends Component {
  constructor(props) {
     super(props)
     this.state = { menu: false
                  , showSecondaryMenu: false
                  , primarySelected: props.verticalMenu[0].key
                  , secondarySelected: undefined
                  }
  }

  static propTypes = {
    name:         PropTypes.string,
    // nameOnClick:  PropTypes.func,
    messageCount: PropTypes.oneOfType([ PropTypes.string
                                      , PropTypes.number
                                      ]),
    messageonClick:       PropTypes.func,
    callToAction:         PropTypes.array, // [{label, state, onClick}, ... ]

    verticalMenu:         PropTypes.array, // [{label, key, icon, onClick}, ... ]

    verticalSecondaryMenu:         PropTypes.array, // [{label, key, onClick}, ... ]

    garageSelectorContent: PropTypes.array, // [{name, image }, ...]
    onGarageSelect:        PropTypes.func,
  }

  render(){
    const { name, nameOnClick, messageCount, messageonClick, callToAction,
      verticalMenu, verticalSecondaryMenu, verticalSecondaryMenuSelected,
      garageSelectorContent, onGarageSelect,
      children } = this.props

    const onHamburgerClick = (e) => { this.setState({ menu: !this.state.menu }) }

    const verticalMenuOnClick = (o) => {
      const newOnClick = () => {
        if (o.key === 'admin'){
          this.setState({...this.state, showSecondaryMenu: !this.state.showSecondaryMenu})
        } else {
          this.setState({...this.state, primarySelected: o.key, secondarySelected: undefined, showSecondaryMenu: false, menu: false})
          o.onClick()
        }
      }
      return {...o, onClick: newOnClick }
    }

    const secondaryVerticalMenuOnClick = (o) => {
      const newOnClick = () => {
        this.setState({...this.state, primarySelected: 'admin', secondarySelected: o.key, menu: false, showSecondaryMenu: false})
        o.onClick()
      }
      return {...o, onClick: newOnClick }
    }

    const createCallToActionButton = object => <CallToActionButton label={object.label} state={object.state} onClick={object.onClick} />

    return(
      <div>
        <div className={styles.horizontalMenu}>
          <a onClick={onHamburgerClick} className={styles.hamburger}>
            <i className="fa fa-bars" aria-hidden="true"></i>
          </a>
          <div className={styles.logoContainer}>
            <Logo style='rect' />
          </div>

          <div className={styles.horizontalMenuContent}>
            <div className={styles.theContent}>
              <div className={styles.callToAction}>
                {callToAction.map(createCallToActionButton)}
              </div>

              <div className={styles.user}>
                <div className={styles.messages} onClick={messageonClick}>
                  <i className={"fa fa-commenting-o"} aria-hidden="true"></i>
                  {messageCount > 0 && <div className={styles.count}>{messageCount}</div>}
                </div>

                <div className={styles.profile} onClick={nameOnClick}>
                  <i className={"fa fa-user"} aria-hidden="true"></i>
                  <span className={styles.name}>{name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.page}>
          <div className={`${styles.verticalMenu} ${this.state.showSecondaryMenu && styles.shift} ${this.state.menu && styles.active}`}>
            <GarageSelector content={garageSelectorContent} onSelect={onGarageSelect} />
            <VerticalMenu content={verticalMenu.map(verticalMenuOnClick)} selected={this.state.primarySelected} onClick={()=>{this.setState({menu: false})}}/>
          </div>

          <div className={`${styles.secondaryVerticalMenu} ${this.state.showSecondaryMenu && styles.shift} ${this.state.secondarySelected === undefined && styles.hideAdmin}`}>
            <VerticalSecondaryMenu content={verticalSecondaryMenu.map(secondaryVerticalMenuOnClick)} selected={this.state.secondarySelected} onBack={()=>{this.setState({...this.state, menu: true, showSecondaryMenu: false})}}/>
          </div>

          <div className={`${styles.content} ${this.state.showSecondaryMenu && styles.shift}`}>
            <Breadcrumbs/>
            <div className={styles.children}>
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
