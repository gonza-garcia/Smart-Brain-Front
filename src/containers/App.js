import React, {Component} from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from '../components/FaceRecognition/FaceRecognition.js';
import Navigation from '../components/Navigation/Navigation.js';
import SignIn from '../components/SignIn/SignIn.js';
import Register from '../components/Register/Register.js';
import Logo from '../components/Logo/Logo.js';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm.js';
import Rank from '../components/Rank/Rank.js';
import './App.css';

const particlesOptions =  {
  particles: {
    number: {
      value: 35,
      density: {
        enable: true,
        value_area: 800,
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'SignIn',
  isSignedIn: false,
  user: {
    id:       '',
    name:     '',
    email:    '',
    entries:  0,
    joined:   '',
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = data => {
    this.setState({
      user: {
        id:       data.id,
        name:     data.name,
        email:    data.email,
        entries:  data.entries,
        joined:   data.joined,
      }
    })
  }

  calculateFaceLocation = (data) => {
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height),
      }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onPictureSubmit = () => {
      this.setState({imageUrl: this.state.input});

      fetch('https://murmuring-woodland-01911.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://murmuring-woodland-01911.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(console.log);
  }

  onRouteChange = (route) => {
    if      (route === 'SignOut') this.setState(initialState);
    else if (route === 'Home')    this.setState({isSignedIn: true});
    
    this.setState({route: route});
  }

  render() {
      const {isSignedIn, route, imageUrl, box} = this.state;
      return (
        <div className="App">
            <Particles className='particles' param={particlesOptions} />
            <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
            { route === 'Home'
              ? <div>
                  <Logo />
                  <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                  <ImageLinkForm
                    onInputChange={this.onInputChange}
                    onButtonSubmit={this.onPictureSubmit}
                  />
                  <FaceRecognition
                    box={box}
                    imageUrl={imageUrl}
                  />
                </div>
              : (
                route === 'SignIn'
                ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              )
            }
        </div>
      );
  }
}

export default App;
