import { t } from '../modules/localization/localization'
import { request } from './request'


export default function upload(onSuccess, event, query, variables = null) {
  const file = event.target.files[0]
  if (file == null) return alert(t([ 'pageBase', 'noFileSelected' ]))

  const uploadFile = (file, signedRequest, url) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', signedRequest)
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          onSuccess(url)
        } else {
          onSuccess(null)
          alert(t([ 'pageBase', 'couldNotUpload' ]))
        }
      }
    }
    xhr.send(file)
  }

  const onPresignedSuccess = response => {
    const parsedResponse = JSON.parse(response.data[Object.keys(response.data)[0]]) // select first key
    uploadFile(file, parsedResponse.signedRequest, parsedResponse.url)
  }

  request(onPresignedSuccess, query, { ...variables, file_name: encodeURIComponent(file.name), file_type: file.type })
}
