import React from 'react'
import axios from 'axios'

class SequenceForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {value: ''}

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (event) {
    this.setState({value: event.target.value})
  }

  handleSubmit (event) {
    axios.put('http://localhost:8888/api/store_sequence/' + this.state.value)
    .then(function (response) {
      // Important learning experience: console.log here shows in the Chrome console.
      // Also, JSON.stringify() can be used like PHP's var_dump.
      // console.log(JSON.stringify(response)) // response.data: NY response.status: 200
      if (response.status === 200) {
        // when the pseudo db server is working it will almost always return 200
        // it's up to this script to determin from the json object how the
        // storing of the sequence went.
        console.log('response is: ' + JSON.stringify(response))
        console.log(typeof response.data)
        // response is: {"data":"PA","status":200,"statusText":"OK","headers...
        // response is: {"data":{"sequence":"P","verdict":"false"},"status":200...
        // if response.data is object, that's bad.
        // if it's string, that's good.
        if (typeof response.data === 'string') {
          alert('Sequence is valid. ' + response.data + ' submitted to database.')
        } else if (typeof response.data === 'object') {
          alert('Sequence ' + response.data.sequence + ' ISN\'T valid.')
        }
      } else {
        alert('Something terrible happened.')
      }
    })
    .catch(function (error) {
      alert('Sequence ' + this.state.value + ' ISN\'T valid.')
      console.log('DIDN\'T GOT IT!!!' + error)
    })

    // THE FOLLOWING WORKS BEAUTIFULLY AS PROOF OF CONCEPT.
    // NOTE: this code does not use db.js, thereby making things much less confusing.
    // // alert('Sequence submitted: ' + this.state.value) // shows we're getting user input
    // axios.get('http://localhost:8888/api/store_sequence/' + this.state.value)
    // .then(function (response) {
    //   // Important learning experience: console.log here shows in the Chrome console.
    //   // Also, JSON.stringify() can be used like PHP's var_dump.
    //   if (response.data.verdict.length > 1) {
    //     alert('Sequence submitted: ' + response.data.sequence + ' ISN\'T valid.') // alerts block!
    //   } else {
    //     alert('Sequence submitted: ' + response.data.sequence + ' is valid.') // alerts block!
    //   }
    // })
    // .catch(function (error) {
    //   console.log('DIDN\'T GOT IT!!!' + error)
    // })

    event.preventDefault()
  }

  render () {
    return (
      <div className='search-box'>
        <form className='text-center' onSubmit={this.handleSubmit}>
          <label>
            Sequence:
            <input type='text' value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type='submit' value='Submit' />
        </form>
      </div>
    )
  }
}

export default SequenceForm
