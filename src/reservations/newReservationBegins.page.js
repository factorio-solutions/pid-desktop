import React, { Component, PropTypes }  from 'react';
import { bindActionCreators }           from 'redux'
import { connect }                      from 'react-redux'
import moment                           from 'moment'
import * as ReactDOM                    from 'react-dom'

import styles from './newReservation.page.scss'

import Page        from '../_shared/containers/mobilePage/Page'
import MobileTable from '../_shared/components/mobileTable/MobileTable'
import Form        from '../_shared/components/form/Form'
import Input       from '../_shared/components/input/Input'

import * as paths                 from '../_resources/constants/RouterPaths'
import * as newReservationActions from '../_shared/actions/mobile.newReservation.actions'


export class NewReservationBeginsPage extends Component {
  constructor(props) {
     super(props);
     this.state = {
       from:    props.state.from,
       fromNow: props.state.fromNow
     }
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentWillReceiveProps(next){
    this.props.actions.checkGarageChange(this.props.mobileHeader.garage_id, next.mobileHeader.garage_id)
  }

  componentDidMount() {
    setTimeout(function(){ // HACK: opening date time input - Android tested
      document.getElementsByClassName(styles.dateInput)[0].click()
    }, 25)
  }

  render() {
    const { state, actions } = this.props
    const { router } = this.context

    const back = () => {
      router.push(paths.RESERVATION_ADD)
    }

    const beginsRow = () => {
      const nowClick   = () => {this.setState({fromNow: true, from: undefined})}
      const handleFrom = (event) => { event.target.checkValidity() && this.setState({fromNow: false, from: event.target.value}) }

      return(
        <div>
          <div className={styles.rowContainer}>
            <span onClick={nowClick} className={`${this.state.fromNow ? styles.selected : styles.notSelected}`}>NOW</span>
          </div>
          <input className={styles.dateInput} type="datetime-local" value={this.state.from || moment(moment()).format('YYYY-MM-DDTHH:mm')} onChange={handleFrom} />
        </div>
      )
    }

    const content = [
      {label: 'Begins', row: beginsRow()}
    ]

    const isSubmitable = () => {
      if (state.from == undefined && state.fromNow == false){ return false }
      return true
    }

    const onSubmit = () => {
      actions.setFromNow(this.state.fromNow)
      actions.setFrom(this.state.from)
      back()
    }

    return (
      <Page label="New reservation" margin={true}>
        <Form onSubmit={onSubmit} onBack={back} submitable={isSubmitable()} mobile={true}>
          <MobileTable content={content} />
        </Form>
      </Page>
    )
  }
}

export default connect(state => {
  const { mobileNewReservation, mobileHeader } = state
  return ({
    state: mobileNewReservation,
    mobileHeader
  })
}, dispatch => ({
  actions: bindActionCreators(newReservationActions, dispatch)
}))(NewReservationBeginsPage)
