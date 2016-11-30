import React from 'react'

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
    function doSequence (url, callback) {
      var httpRequest // create our XMLHttpRequest object
      if (window.XMLHttpRequest) {
        httpRequest = new XMLHttpRequest()
      } else if (window.ActiveXObject) { // internet exploder
        httpRequest = new
        ActiveXObject('Microsoft.XMLHTTP')
      }
      httpRequest.onreadystatechange = function () {
        // check the status of our request
        // keeps being called on every state change
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
          // only does the callback upon return of httpRequest
          callback.call(httpRequest.responseXML) // call refers to the 'this' of the argument (httpRequest...)
        }
      }
      httpRequest.open('PUT', url);
      httpRequest.send();
    }
    // call the function
    doSequence('http://localhost:8888/api/store_sequence/' + this.state.value, function () {
      console.log(JSON.stringify(this))
      alert('Sequence is valid. Submitted to database.')
    })
    console.log('this will run before the above callback')
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
