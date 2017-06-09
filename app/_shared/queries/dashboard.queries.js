// download news and garage layout and some statistics
export const INIT_DASHBOARD = `query{
  news{
    id
    label
    url
    created_at
  }
}
`
