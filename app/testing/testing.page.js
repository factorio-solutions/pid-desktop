import React, { Component } from 'react'

import requestPromise from '../_shared/helpers/requestPromise'
import { GET_CURRENT_USER } from '../_shared/queries/pageBase.queries'


export default class TestingPage extends Component {
  render() {
    async function downloadStuff() {
      console.log('current user is', await requestPromise(GET_CURRENT_USER))
    }


    function iterate() {
      const myIterable = {}
      myIterable[Symbol.iterator] = function* () {
        yield 1
        yield 2
        yield 3
      }

      for (const value of myIterable) {
        console.log(value)
      }
      console.log([ ...myIterable ])
    }


    function iterate2() {
      function* generateIterator() {
        yield 1
        yield 2
        yield 3
      }

      const myIterable = generateIterator()

      for (const value of myIterable) {
        console.log(value)
      }
      console.log('will not reurn stuff, cuz iterator is finished by now', [ ...myIterable ])
    }


    function iterate3() {
      function* generateIterator() {
        yield* [ 1, 2, 3 ]
      }

      const myIterable = generateIterator()

      for (const value of myIterable) {
        console.log('Values delegated to another generator, in this case an array', value)
      }
    }


    function iterate4() {
      function* delegator() {
        yield 1
        yield 2
        yield 3
      }

      function* generator() {
        yield* delegator()
      }

      const myIterable = generator()

      for (const value of myIterable) {
        console.log(value)
      }
    }


    return (
      <div>
        <h1>Testing page</h1>
        <div onClick={downloadStuff}>click me</div>
        <div onClick={iterate}>iterate</div>
        <div onClick={iterate2}>iterate2</div>
        <div onClick={iterate3}>iterate3</div>
        <div onClick={iterate4}>iterate4</div>
      </div>
    )
  }
}
