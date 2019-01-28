import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import PageBase from '../../_shared/containers/adminPageBase/PageBase'
import Input from '../../_shared/components/input/Input'
import Form from '../../_shared/components/form/Form'

import {
  downloadAllVersions,
  setAppVersion,
  uploadAllVersions
} from '../../_shared/actions/pid-admin.mobileAppVersion.actions'

class MobileAppVersion extends Component {
  static propTypes = {
    state:               PropTypes.object,
    downloadAllVersions: PropTypes.func,
    uploadVersion:       PropTypes.func,
    setVersion:          PropTypes.func
  }

  componentDidMount() {
    const { downloadAllVersions: downloadVersions } = this.props
    downloadVersions()
  }

  render() {
    const { state, setVersion, uploadVersion } = this.props
    return (
      <PageBase>
        <Form onSubmit={uploadVersion} submitable={() => true}>
          <div style={{ width: '400px' }}>
            {state.versions.map(version => {
              return (
                <Input
                  value={version.version}
                  label={version.platform}
                  onChange={value => setVersion(value, version.id)}
                />
              )
            })}
          </div>
        </Form>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.pidAdminMobileAppVersion }),
  {
    downloadAllVersions,
    setVersion: setAppVersion,
    uploadVersion: uploadAllVersions
  }
)(MobileAppVersion)
