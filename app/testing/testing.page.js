import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import aws from 'aws-sdk'

import { request } from '../_shared/helpers/request'


export class TestingPage extends Component {
  render() {
    const presignedQuery = `query UploadFile{
        upload_garage_image
      }
    `

    const fileSelected = (e) => {
      const file = e.target.files[0]
      if(file == null){
        return alert('No file selected.');
      }
      getSignedRequest(file);
    }

    function getSignedRequest(file){
      const onSuccess = response => {
        const parsedResponse = JSON.parse(response.data.upload_garage_image)
        console.log(parsedResponse);
        uploadFile(file, parsedResponse.signedRequest, parsedResponse.url);
      }
      request(onSuccess, presignedQuery, { file_name: encodeURIComponent(file.name), file_type:file.type })
    }

    function uploadFile(file, signedRequest, url){
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedRequest);
      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
          if(xhr.status === 200){
            document.getElementById('preview').src = url;
            document.getElementById('avatar-url').value = url;
          }
          else{
            alert('Could not upload file.');
          }
        }
      };
      xhr.send(file);
    }


    return (
      <div>
        <h1>Testing page</h1>

        <input type="file" id="file-input" onChange={fileSelected} />
        <p id="status">Please select a file</p>
        <img id="preview" src="/images/default.png" />

        <form method="POST" action="/save-details">
          <input type="hidden" id="avatar-url" name="avatar-url" value="/images/default.png" />
          <input type="text" name="username" placeholder="Username" /><br />
          <input type="text" name="full-name" placeholder="Full name" /><br />
          <input type="submit" value="Update profile" />
        </form>
      </div>
    )
  }
}

export default connect(
  state    => ({ }),
  dispatch => ({ })
)(TestingPage)
