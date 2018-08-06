import React, { Component } from 'react';
import Header from '../../Components/Header/Header';
import TripsView from '../../Components/Trips/TripsView';
import TripsSearchForm from '../../Components/TripsSearchForm/TripsSearchForm'

class Trips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    fetch('/api/trips',
        { credentials: 'include' })
      .then(res => res.json())
      .then((res) => {
        this.setState({ data: res });
      });
  }

  handleSearchSubmit = (formData) => {
    fetch(`/api/trips/search?${formData}`, {
      headers: {
        'Content-Type': 'application/text'
      },
      method: 'GET',
    })
      .then(res => res.json())
      .then((res) => {        
          this.setState({ data: res })
      })
      .catch(err => console.log(`request failed ${err.message}`));
  }

  render() {
    return (
      <div>
        <Header />
        <main>
          <TripsSearchForm handleSearchSubmit={this.handleSearchSubmit} />
          <TripsView data={this.state.data} />
        </main>
      </div>
    );
  }
}

export default Trips;
