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
    window.addEventListener('error', (e) => {
      if (e.message != this.state.lastError) { // error cycle
        this.setState({lastError: e.message})
        const log = "Error occured at " + window.location.hash + " / " + e.message + " / " + JSON.stringify(store.getState())
        request((response)=>{}, 'mutation ErrorSend ($error: String!) { error(error: $error) }', {error: log})
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
