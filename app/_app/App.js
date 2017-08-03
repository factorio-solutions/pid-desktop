import React, { Component, PropTypes }  from 'react'
import { request }                      from '../_shared/helpers/request'


export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  }

// ============================================================================
// Error logging
  constructor(props) {
     super(props);
     this.state = {lastError: undefined}
  }

  static contextTypes = {
    store: PropTypes.object
  }

  componentDidMount(){
    const { store } = this.context
    const state = store.getState().pageBase
    window.addEventListener('error', (e) => {
      if (e.message != this.state.lastError) { // block error cycle
        const log = "Error occured at " + window.location.hash + " / " + e.message + " / user:" + state.current_user && state.current_user.email
        console.log(log);
        request((response)=>{}, 'mutation ErrorSend ($error: String!) { error(error: $error) }', {error: log})
        this.setState({lastError: e.message})
      }
    });
  }
// ============================================================================

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
