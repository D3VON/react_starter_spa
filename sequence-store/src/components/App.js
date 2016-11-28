import React, { Component } from 'react'
import SequenceForm from './SequenceForm'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div className='app'>
        <h1>Store new sequences here: </h1>
        <SequenceForm />
      </div>
    )
  }
}
