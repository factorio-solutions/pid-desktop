import request from './request'

export default function requestPromise(query, variables = null) {
  return new Promise((resolve, reject) => {
    const onSuccess = response => resolve(response.data)

    request(onSuccess, query, variables, null, reject)
  })
}
