// Will create new news
export const CREATE_NEWS = `mutation CreateNews($news: NewsInput!) {
  create_news(news: $news) {
    id
  }
}
`

// Will edit new news
export const EDIT_NEWS = `mutation UpdateNews($news: NewsInput!, $id: Id!) {
  update_news(news: $news, id: $id) {
    id
  }
}
`
