import React, { Component, PropTypes }  from 'react'

import Logo                  from '../logo/Logo'
import CallToActionButton    from '../buttons/CallToActionButton'
import MenuButton            from '../buttons/MenuButton'
import GarageSelector        from '../garageSelector/GarageSelector'
import VerticalMenu          from '../verticalMenu/VerticalMenu'
import VerticalSecondaryMenu from '../verticalMenu/VerticalSecondaryMenu'

import styles from './MasterPage.scss'


export default class MasterPage extends Component {
  constructor(props) {
     super(props)
     this.state = {menu: false}
  }

  static propTypes = {
    name:         PropTypes.string,
    nameOnClick:  PropTypes.func,
    messageCount: PropTypes.oneOfType([ PropTypes.string
                                      , PropTypes.number
                                      ]),
    messageonClick:       PropTypes.func,
    callToAction:         PropTypes.array, // [{label, state, onClick}, ... ]

    verticalMenu:         PropTypes.array, // [{label, key, icon, onClick}, ... ]
    verticalMenuSelected: PropTypes.string, // key of selected item

    verticalSecondaryMenu:         PropTypes.array, // [{label, key, onClick}, ... ]
    verticalSecondaryMenuSelected: PropTypes.string, // key of selected item
    showSecondaryMenu:             PropTypes.bool,

    garageSelectorContent: PropTypes.array, // [{name, image }, ...]
    onGarageSelect:        PropTypes.func,
  }

  render(){
    const { name, nameOnClick, messageCount, messageonClick, callToAction,
      verticalMenu, verticalMenuSelected, verticalSecondaryMenu, verticalSecondaryMenuSelected, showSecondaryMenu,
      garageSelectorContent, onGarageSelect, children } = this.props

    const onHamburgerClick = (e) => { this.setState({ menu: !this.state.menu }) }

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
                  {name}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.page}>
          <div className={`${styles.verticalMenu} ${showSecondaryMenu && styles.shift} ${this.state.menu && styles.active}`}>
            <GarageSelector content={garageSelectorContent} onSelect={onGarageSelect} />
            <VerticalMenu content={verticalMenu} selected={verticalMenuSelected} onClick={()=>{this.setState({menu: false})}}/>
            {/*<MenuButton icon, label, onClick, type, state, size, question, count />*/}
          </div>

          <div className={`${styles.secondaryVerticalMenu} ${showSecondaryMenu && styles.shift} ${this.state.menu && styles.active}`}>
            <VerticalSecondaryMenu content={verticalSecondaryMenu} selected={verticalSecondaryMenuSelected} onClick={()=>{this.setState({menu: false})}}/>
          </div>

          <div className={`${styles.content} ${showSecondaryMenu && styles.shift}`}>
            {children}
          </div>
        </div>
      </div>
    )
  }
}
