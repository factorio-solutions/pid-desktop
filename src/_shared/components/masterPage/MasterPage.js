import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import { bindActionCreators }           from 'redux'
import styles                           from './MasterPage.scss'

import * as pageBaseActions from '../../actions/pageBase.actions'


export class MasterPage extends Component {
  constructor(props) {
     super(props);
     this.state = {menu: false}
  }

  static propTypes = {
    state:          PropTypes.object,
    actions:        PropTypes.object,

    logo:           PropTypes.object,
    horizContent:   PropTypes.object,
    vertTopContent: PropTypes.object,
    vertBotContent: PropTypes.object,
    bodyContent:    PropTypes.object,
    filters:        PropTypes.object
  }

  render(){
    const { state, actions, logo, horizContent, vertTopContent, vertBotContent, bodyContent, filters } = this.props
    const { menuWidth } = state

    const onClick = (e) => {
      this.setState({ menu: !this.state.menu })
    };

    // const onDrag = (event) => {
    //   if (event.clientX != 0){
    //     actions.setMenuWidth(event.clientX)
    //   }
    // }

    const menuOnClick = () => {
      actions.setMenuWidth(menuWidth == 200 ? 90 : 200)
    }

    return(
      <div className={this.state.menu && styles.active} id={styles.layout} style={{paddingLeft: menuWidth+'px'}}>
        {/* horizontal menu */}
        <div className={styles.horizontalMenu}>
          <div className={styles.pidLogo} style={{width: menuWidth+'px'}}>
            {logo}
          </div>
          <div className={styles.horizontalMenuContent}>
            {horizContent}
          </div>
          <div className={styles.filters}>
            {filters}
          </div>
        </div>

        {/* Menu icon when collapsed */}
        <a onClick={onClick} className={`${styles.menuLink} ${this.state.menu && styles.active}`}>
          <i className="fa fa-bars" aria-hidden="true"></i>
        </a>

        {/* vertical menu */}
        <div className={this.state.menu && styles.active} id={styles.menu} style={{width: menuWidth+'px'}} onClick={menuOnClick}>
          <div>
            {vertTopContent}
          </div>
          <div className={styles.bottom} style={{width: menuWidth+'px'}}>
            {vertBotContent}
          </div>
        </div>
        {/* <div className={styles.resizeLine} onDrag={onDrag} style={{left: menuWidth+'px'}}> </div> */}

        {/* Body of page */}
        <div className={styles.content}>
          {bodyContent}
        </div>
      </div>
    )
  }
}


export default connect(
  state    => ({ state: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(pageBaseActions, dispatch) })
)(MasterPage)
