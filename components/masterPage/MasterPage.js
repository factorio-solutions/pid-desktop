import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import { bindActionCreators }           from 'redux'
import styles                           from './MasterPage.scss'

import * as pageBaseActions from '../../actions/pageBase.actions'


<<<<<<< HEAD
export class MasterPage extends Component{
=======
export class MasterPage extends Component {
  constructor(props) {
     super(props);
     this.state = {menu: false}
  }

>>>>>>> feature/new_api
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

<<<<<<< HEAD
    const toggleClass = (element, className) => {
      if (element.className.split(' ').indexOf(className) == -1){
        element.classList.add(className)
      } else {
        element.classList.remove(className)
      }
    }

    const onClick = (e) => {
        var active = styles.active;
        e.preventDefault();
        toggleClass(document.getElementById(styles.layout), active);
        toggleClass(document.getElementById(styles.menu), active);
        toggleClass(document.getElementById('menuLink'), active);
=======
    const onClick = (e) => {
      this.setState({ menu: !this.state.menu })
>>>>>>> feature/new_api
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
<<<<<<< HEAD
      <div id={styles.layout} style={{paddingLeft: menuWidth+'px'}}>
=======
      <div className={this.state.menu && styles.active} id={styles.layout} style={{paddingLeft: menuWidth+'px'}}>
>>>>>>> feature/new_api
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
<<<<<<< HEAD
        <a onClick={onClick} id="menuLink" className={styles.menuLink}>
          <span></span>
        </a>

        {/* vertical menu */}
        <div id={styles.menu} style={{width: menuWidth+'px'}} onClick={menuOnClick}>
=======
        <a onClick={onClick} className={`${styles.menuLink} ${this.state.menu && styles.active}`}>
          <i className="fa fa-bars" aria-hidden="true"></i>
        </a>

        {/* vertical menu */}
        <div className={this.state.menu && styles.active} id={styles.menu} style={{width: menuWidth+'px'}} onClick={menuOnClick}>
>>>>>>> feature/new_api
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


<<<<<<< HEAD
export default connect(state => {
  const { pageBase } = state
  return ({
    state: pageBase
  })
}, dispatch => ({
  actions: bindActionCreators(pageBaseActions, dispatch)
}))(MasterPage)
=======
export default connect(
  state    => ({ state: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(pageBaseActions, dispatch) })
)(MasterPage)
>>>>>>> feature/new_api
