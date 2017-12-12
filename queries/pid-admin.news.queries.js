// Will return all available news
export const GET_ALL_NEWS = `query{
  news{
    id
    label
    url
    created_at
  }
}
`

// Will delete new news
export const DELETE_NEWS = `mutation DestroyNews($id: Id!) {
  destroy_news(id: $id) {
    id
  }
}
`
