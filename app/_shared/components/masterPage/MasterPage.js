import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import Logo                  from '../logo/Logo'
import CallToActionButton    from '../buttons/CallToActionButton'
import I                     from '../buttons/I'
import GarageSelector        from '../garageSelector/GarageSelector'
import VerticalMenu          from '../verticalMenu/VerticalMenu'
import VerticalSecondaryMenu from '../verticalMenu/VerticalSecondaryMenu'
import DropdownContent       from '../dropdown/DropdownContent'

import * as nav                 from '../../helpers/navigation'
import { changeHints }          from '../../actions/profile.actions'
import { setShowSecondaryMenu } from '../../actions/pageBase.actions'

import styles from './MasterPage.scss'


class MasterPage extends Component {
  static propTypes = {
    actions:  PropTypes.object,
    pageBase: PropTypes.object,

    name:         PropTypes.string,
    messageCount: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    callToAction: PropTypes.array, // [{label, state, onClick}, ... ]

    verticalMenu:     PropTypes.array, // [{label, key, icon, onClick}, ... ]
    verticalSelected: PropTypes.string,

    verticalSecondaryMenu:     PropTypes.array, // [{label, key, onClick}, ... ]
    verticalSecondarySelected: PropTypes.string,
    showSecondaryMenu:         PropTypes.bool,
    secondaryMenuBackButton:   PropTypes.object, // {label, onClick}

    showHints: PropTypes.bool,
    hint:      PropTypes.object, // {hint, href}

    profileDropdown: PropTypes.object, // [ DOMelement, ... ]
    children:        PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = { menu: false }
  }

  onHamburgerClick = () => {
    this.setState({ menu: !this.props.pageBase.showSecondaryMenu && !this.state.menu })
    this.props.actions.setShowSecondaryMenu(false)
  }

  onLogoClick = () => nav.to('/dashboard')
  onMessageClick =() => nav.to('/notifications')
  verticalMenuClick = () => this.setState({ menu: false })
  secondaryVerticalMenuClick = () => {
    this.setState({ menu: true })
    this.props.secondaryMenuBackButton.onClick()
  }

  render() {
    const {
      actions,
      name,
      messageCount,
      callToAction,
      verticalMenu,
      verticalSelected,
      verticalSecondaryMenu,
      verticalSecondarySelected,
      showSecondaryMenu,
      secondaryMenuBackButton,
      showHints,
      hint,
      profileDropdown,
      children
    } = this.props


    const createCallToActionButton = object => <CallToActionButton label={object.label} state={object.state} onClick={object.onClick} />

    return (
      <div>
        <div className={styles.horizontalMenu}>
          <a onClick={this.onHamburgerClick} className={styles.hamburger}>
            <i className="fa fa-bars" aria-hidden="true" />
          </a>
          <div className={styles.logoContainer} onClick={this.onLogoClick}>
            <Logo style="rect" />
          </div>

          <div className={styles.horizontalMenuContent}>
            <div className={styles.theContent}>
              <div className={styles.callToAction}>
                {callToAction.map(createCallToActionButton)}
              </div>

              <div className={styles.user}>
                <div className={styles.messages}>
                  {!showHints && <I size="small" onClick={actions.changeHints} />}
                </div>

                <div className={styles.messages} onClick={this.onMessageClick}>
                  <i className={'icon-message'} aria-hidden="true" />
                  {messageCount > 0 && <div className={styles.count}>{messageCount}</div>}
                </div>

                <DropdownContent content={profileDropdown} style={styles.profileDropdown}>
                  <div className={styles.profile} >
                    <i className={'icon-profile'} aria-hidden="true" />
                    <span className={styles.name}>{name}</span>
                  </div>
                </DropdownContent>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.page}>
          <div className={`${styles.verticalMenu} ${showSecondaryMenu && styles.shift} ${this.state.menu && styles.active}`}>
            <GarageSelector />
            <VerticalMenu content={verticalMenu} selected={verticalSelected} onClick={this.verticalMenuClick} />
          </div>

          <div className={`${styles.secondaryVerticalMenu} ${showSecondaryMenu && styles.shift} ${verticalSecondarySelected === undefined && styles.hideAdmin}`}>
            <VerticalSecondaryMenu
              content={verticalSecondaryMenu}
              selected={verticalSecondarySelected}
              backContent={{ ...secondaryMenuBackButton, onClick: this.secondaryVerticalMenuClick }}
            />
          </div>

          <div className={`${styles.content} ${showSecondaryMenu && styles.shift}`}>
            {showHints && hint && <div className={styles.hint}>
              <div className={styles.hintCross} onClick={actions.changeHints}>
                <i className="fa fa-times" aria-hidden="true" />
              </div>
              <I />
              <div dangerouslySetInnerHTML={{ __html: hint.hint }} />
            </div>}
            <div className={`${styles.children} ${showHints && hint && styles.hashHint}`}>
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({ pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators({ changeHints, setShowSecondaryMenu }, dispatch) })
)(MasterPage)
