const actionFactory = type => value => ({ type, value })
export default actionFactory
// export default function actionFactory(type) {
//   return value => ({ type, value })
// }
