import React, { Component, PropTypes }  from 'react'
import { request }                      from '../_shared/helpers/request'

<<<<<<< HEAD
=======

>>>>>>> feature/new_api
export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  }

<<<<<<< HEAD
=======
// ============================================================================
// Error logging
>>>>>>> feature/new_api
  constructor(props) {
     super(props);
     this.state = {lastError: undefined}
  }
<<<<<<< HEAD
  static contextTypes = {
    store: PropTypes.object
  }
  componentDidMount(){
    const { store } = this.context
    this.unsubscribe = store.subscribe(() => { this.forceUpdate() })

    window.addEventListener('error', (e) => {
      if (e.message != this.state.lastError) { // error cycle
        this.setState({lastError: e.message})
        const log = "Error occured at " + window.location.hash + " / " + e.message + " / " + JSON.stringify(store.getState())
=======

  static contextTypes = {
    store: PropTypes.object
  }

  componentDidMount(){
    const { store } = this.context
    window.addEventListener('error', (e) => {
      if (e.message != this.state.lastError) { // block error cycle
        this.setState({lastError: e.message})
        const log = "Error occured at " + window.location.hash + " / " + e.message + " / " + JSON.stringify(store.getState())
        console.log("Error occured at " + window.location.hash + " / " + e.message);
>>>>>>> feature/new_api
        request((response)=>{}, 'mutation ErrorSend ($error: String!) { error(error: $error) }', {error: log})
      }
    });
  }
<<<<<<< HEAD
  componentWillUnmount () {
    this.unsubscribe()
  }
=======
// ============================================================================
>>>>>>> feature/new_api

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
