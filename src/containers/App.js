import React, {Component, Fragment} from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from '../components/FaceRecognition/FaceRecognition.js';
import Navigation from '../components/Navigation/Navigation.js';
import SignIn from '../components/SignIn/SignIn.js';
import Register from '../components/Register/Register.js';
import Logo from '../components/Logo/Logo.js';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm.js';
import Rank from '../components/Rank/Rank.js';
import './App.css';
import { get_from_server, loadImage } from '../functions/functions.js';


const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800,
      }
    }
  }
}


const initialState = {
    imageUrl: '',
    imageSourceIsLocal: false,
    boxes: [],
    route: 'SignIn',
    isSignedIn: false,
    message: '',
    isLoading: false,
    user: {
      id:       '',
      name:     '',
      email:    '',
      entries:  0,
      joined:   '',
    }
}
// const initialState = {
//     imageUrl: '',
//     imageSourceIsLocal: false,
//     boxes: [],
//     route: 'Home',
//     isSignedIn: true,
//     message: '',
//     isLoading: false,
//     user: {
//       id:       1,
//       name:     "gonza",
//       email:    "gonzalo@gmail.com",
//       entries:  6,
//       joined:   "2019-11-29T19:34:51.218Z",
//     }
// }

const formRef = React.createRef();
const imageRef = React.createRef();
const messageRef = React.createRef();

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = user => {
    this.setState({
      isSignedIn: true,
      user: {
        id:       user.id,
        name:     user.name,
        email:    user.email,
        entries:  user.entries,
        joined:   user.joined,
      }
    }, () => {})
  }

  calculateFacesLocations = (clarifai_regions) => {
      const width = Number(imageRef.current.width);
      const height = Number(imageRef.current.height);

      const boxes = clarifai_regions.map(region => {
          let clarifai_box = region.region_info.bounding_box;
          return {
            leftCol:    width   * clarifai_box.left_col,
            topRow:     height  * clarifai_box.top_row,
            rightCol:   width   - (width  * clarifai_box.right_col),
            bottomRow:  height  - (height * clarifai_box.bottom_row),
          }
      })

      return boxes;
  }

  displayFaceBoxes = (boxes) => {
    this.setState({ boxes: boxes });
  }

  onInputChange = (event) => {
      this.setState({ imageUrl: event.target.value, imageSourceIsLocal: false, boxes: [] });
  }
  
  onImageUpload = (event) => {

      const files = event.target.files[0];

      let fileReader = new FileReader();

      fileReader.onloadend = async () => {
          this.setState({ imageUrl: fileReader.result, imageSourceIsLocal: true, boxes: [] });
      }

      if (files) {
          if (files.type.split('/')[0] !== 'image') {
              this.showMessage(`The file doesn't look like a valid image.`);
              return;
          };
          if (files.size > 10485760) {
              this.showMessage(`Sorry. The image is too big. Try one below 10 MB.`);
              return;
          };

          formRef.current['textInput'].value = `Upload mode selected:\n${files.name}`;
          formRef.current['textInput'].setAttribute("disabled", "true");

          fileReader.readAsDataURL(files);
      }
  }

  onDetect = async (event) => {
      this.setState({ isLoading: true });

      let url = this.state.imageSourceIsLocal ? this.state.imageUrl.replace(/^data:image.+;base64,/, '') : this.state.imageUrl;

      try
      {
          await loadImage(this.state.imageUrl); //loadImage will throw an error if it's not an image

          const regions = await get_from_server('/image/predict', {
              method: 'post',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ imageUrl: url })
          });

          const entries = await get_from_server('/image/afterpredict', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ id: this.state.user.id })
          });

          this.setState(Object.assign(this.state.user, {entries: entries}));
          this.setState({ isLoading: false });

          this.displayFaceBoxes(this.calculateFacesLocations(regions));

          imageRef.current.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
      }
      catch (error) {
          this.showMessage(error);
          this.setState({ isLoading: false });
      }
  }


  onClear = () => {
      formRef.current.reset();
      formRef.current['textInput'].removeAttribute("disabled");
      this.setState({ imageUrl: '', imageSourceIsLocal: true, boxes: [], message: '', isLoading: false });
  }

  showMessage = (message) => {
      if (typeof message !== 'string') message = 'Unknown error. Try uploading a smaller image.';
      
      this.setState({ message: message }, () => {
          messageRef.current.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
      });

      setTimeout(() => {this.setState({ message: '' })}, 4000);
  }

  changeToRoute = (route) => {
      switch(route) {
        case 'Register':
            this.setState({ route: route });
            break;
        case 'SignIn':
            this.setState({ route: route });
            break;
        case 'SignOut':
            this.setState(initialState);
            break;
        case 'Home':
            this.setState({ isSignedIn: true, route: route});
            break;
        case 'Profile':
            console.log('If you are seeing this, have an awesome day.')
            break;
        default:
            console.log('Ruta? No hay ruta');
      }
  }


  render() {
      const {isSignedIn, route, user, message, imageUrl, isLoading} = this.state;

      return isSignedIn
      ? (
        <Fragment>
            <Particles className='particles' params={particlesOptions} />
            <Navigation user={user} isSignedIn={isSignedIn} changeToRoute={this.changeToRoute}/>
            <main className='main-section'>
                <aside className='sidebar'>
                    <Logo />
                    <Rank user={user}/>
                    <ImageLinkForm
                      isLoading={isLoading}
                      onInputChange={this.onInputChange}
                      onImageUpload={this.onImageUpload}
                      onDetect={this.onDetect}
                      onClear={this.onClear}
                      ref={formRef}
                    />
                    <p
                      style={{fontSize: '1.5rem', color: '#ffbb00', fontWeight:'300'}}
                      ref={messageRef}>{message}</p>
                </aside>
                <section className='section'>
                    <FaceRecognition
                      boxes={this.state.boxes}
                      imageUrl={imageUrl}
                      ref={imageRef}
                    />
                </section>
            </main>
        </Fragment>
      )
      : (
        <Fragment>
            <Particles className='particles' params={particlesOptions} />
            <Navigation user={user} isSignedIn={isSignedIn} changeToRoute={this.changeToRoute}/>
            <Logo />
            {
              route === 'SignIn'
              ? <SignIn loadUser={this.loadUser} changeToRoute={this.changeToRoute} />
              : <Register loadUser={this.loadUser} changeToRoute={this.changeToRoute} />
            }
        </Fragment>
      );
  }
}

export default App;
