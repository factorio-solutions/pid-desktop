import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const withMasterPageConf = (WrappedComponent, action) => {
  return class extends Component {
    static propTypes = {
      dispatch: PropTypes.func
    }

    componentDidMount() {
      const { dispatch } = this.props

      if (typeof action === 'function' && action.length === 0) {
        dispatch(action())
      } else {
        dispatch(action)
      }
    }

    render() {
      return (
        <WrappedComponent {...this.props} />
      )
    }
  }
}

export default action => (
  WrapperComponent => connect(null, null)(withMasterPageConf(WrapperComponent, action))
)
