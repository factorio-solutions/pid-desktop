// will create new client
export const CREATE_NEW_CLIENT = `mutation clientMutations($client: ClientInput!) {
  create_client(client: $client) {
    id
  }
}
`

export const CREATE_NEW_TEMPLATE = `mutation templateMutations($sms_template: SmsTemplateInput!, $client_id: Id!) {
  create_sms_template(sms_template: $sms_template, client_id:$client_id) {
    id
    name
    template
  }
}
`

// fetches a name of client to rename
export const EDIT_CLIENT_INIT = `query ($id: Id!) {
  client(id: $id) {
    id
    name
    sms_api_token
    is_sms_api_token_active
    ic
    dic
    address{
      line_1
      line_2
      city
      postal_code
      state
      country
    }
    sms_templates{
      id
      name
      template
    }
  }
}
`

// edit client name
export const EDIT_CLIENT_MUTATION = `mutation RenameClient($client: ClientInput!, $id: Id!) {
  update_client(client: $client, id: $id) {
    id
  }
}
`

export const LOAD_INFO_FROM_IC = `query IcToInfo($ic:String){
  ares(ic:$ic)
}
`

export const UPDATE_SMS_TEMPLATE = `mutation UpdateSMSTempalte($id: Id!, $sms_template: SmsTemplateInput!) {
  update_sms_template(id: $id, sms_template: $sms_template) {
    id
  }
}
`
