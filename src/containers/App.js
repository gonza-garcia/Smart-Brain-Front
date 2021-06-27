import { useState, useEffect, useRef, Fragment}     from 'react';
import Particles                                    from 'react-particles-js';
import FaceRecognition                              from '../components/FaceRecognition/FaceRecognition.js';
import Navigation                                   from '../components/Navigation/Navigation.js';
import Logo                                         from '../components/Logo/Logo.js';
import ImageLinkForm                                from '../components/ImageLinkForm/ImageLinkForm.js';
import Rank                                         from '../components/Rank/Rank.js';
import CustomForm                                   from './CustomForm/CustomForm.js';
import './App.css';
import { fetch_from_server, loadImage }             from '../functions/functions.js';


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

const App = () => {

    const [ imageUrl, setImageUrl ]                     = useState(initialState.imageUrl);
    const [ imageSourceIsLocal, setImageSourceIsLocal ] = useState(initialState.imageSourceIsLocal);
    const [ boxes, setBoxes ]                           = useState(initialState.boxes);
    const [ route, setRoute ]                           = useState(initialState.route);
    const [ isSignedIn, setIsSignedIn ]                 = useState(initialState.isSignedIn);
    const [ message, setMessage ]                       = useState(initialState.message);
    const [ isLoading, setIsLoading ]                   = useState(initialState.isLoading);
    const [ user, setUser ]                             = useState({ ...initialState.user });

    const formRef       = useRef(null);
    const imageRef      = useRef(null);
    const messageRef    = useRef(null);

    useEffect(() => {
        const timeOut = setTimeout(() => {setMessage('');}, 4000);

        return () => {
            clearTimeout(timeOut);
        };
    }, [message]);


    const loadUser = user => {
        setUser({ ...user });

        setIsSignedIn(true);
    }


    const onInputChange = event => {
        setImageUrl(event.target.value);
        setImageSourceIsLocal(false);
        setBoxes([]);
    }
    
    const onImageUpload = event => {

        const files = event.target.files[0];

        let fileReader = new FileReader();

        fileReader.onloadend = async () => {
            setImageUrl(fileReader.result);
            setImageSourceIsLocal(true);
            setBoxes([]);
        }

        if (files) {
            if (files.type.split('/')[0] !== 'image') {
                showMessage(`The file doesn't look like a valid image.`);
                return;
            };
            if (files.size > 10485760) {
                showMessage(`Sorry. The image is too big. Try one below 10 MB.`);
                return;
            };

            formRef.current['textInput'].value = `Upload mode selected:\n${files.name}`;
            formRef.current['textInput'].setAttribute("disabled", "true");

            fileReader.readAsDataURL(files);
        }
    }


    const calculateFacesLocations = ( clarifai_regions ) => {
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


    const onDetect = async ( event ) => {

        setIsLoading(true);

        let url = imageSourceIsLocal ? imageUrl.replace(/^data:image.+;base64,/, '') : imageUrl;

        try
        {
            await loadImage(imageUrl); //loadImage will throw an error if it's not an image

            const regions = await fetch_from_server('/image/predict', { imageUrl: url }, 'post')

            const entries = await fetch_from_server('/image/afterpredict', { id: user.id }, 'put');

            setUser({ ...user, entries: entries });

            //now we calculate the boxes locations and display them on screen by setting setBoxes
            setBoxes(calculateFacesLocations(regions));

            imageRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
        }
        catch (error) {
            console.log(error);
            showMessage(error);
        }

        setIsLoading(false);
    }


    const onClear = () => {
        formRef.current.reset();
        formRef.current['textInput'].removeAttribute("disabled");

        setImageUrl('');
        setImageSourceIsLocal(true);
        setBoxes([]);
        setMessage('');
        setIsLoading(false);
    }

    const showMessage = msg => {
        if (typeof msg !== 'string') msg = 'Unknown error. Try uploading a smaller image.';
        
        setMessage(msg);

        messageRef.current.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
    }


    const changeToRoute = route => {
        switch(route) {
            case 'Register':
                setRoute(route);
                break;
            case 'SignIn':
                setRoute(route);
                break;
            case 'SignOut':
                setImageUrl(initialState.imageUrl);
                setImageSourceIsLocal(initialState.imageSourceIsLocal);
                setBoxes(initialState.boxes);
                setRoute(initialState.route);
                setIsSignedIn(initialState.isSignedIn);
                setMessage(initialState.message);
                setIsLoading(initialState.isLoading);
                setUser({ ...initialState.user });
                break;
            case 'Home':
                setIsSignedIn(true);
                setRoute(route);
                break;
            case 'Profile':
                console.log('If you are seeing this, have an awesome day.')
                break;
            default:
                console.log('Ruta? No hay ruta');
        }
    }


    const onFormSubmit = async (formFields, inputs) => {

        const serverEndpoint = route === 'SignIn' ? '/signin' : '/register'

        setIsLoading(true);

        let user;

        //here I make an object containing one property for each field in formFields, and the value for each property is gonna be the current value of the input with that same name.
        const payload = formFields.reduce(( accumObject, currentField ) => {
            accumObject[currentField.name] = inputs[currentField.name];
            return accumObject;
        }, {})

        try 
        {
            user = await fetch_from_server(serverEndpoint, payload, 'post');
        }
        catch (error) {
            const msg = (typeof error === 'string')
                            ? error
                            : 'Wrong credentialS. Please try again';

            showMessage(msg);
        }

        setIsLoading(false);

        if (user?.id)
        {
            setMessage('');
            loadUser(user);
            changeToRoute('Home');
        }
    }


    return isSignedIn
        ? (
            <Fragment>
                <Particles className='particles' params={particlesOptions} />
                <Navigation user={user} isSignedIn={isSignedIn} changeToRoute={changeToRoute}/>
                <main className='main-section'>
                    <aside className='sidebar'>
                        <Logo />
                        <Rank user={user}/>
                        <ImageLinkForm
                            isLoading={isLoading}
                            onInputChange={onInputChange}
                            onImageUpload={onImageUpload}
                            onDetect={onDetect}
                            onClear={onClear}
                            ref={formRef}
                        />
                        <p style={{fontSize: '1.5rem', color: '#ffbb00', fontWeight:'300'}}
                            ref={messageRef}>
                            {message}
                        </p>
                    </aside>
                    <section className='section'>
                        <FaceRecognition
                            boxes={boxes}
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
                <Navigation user={user} isSignedIn={isSignedIn} changeToRoute={changeToRoute}/>
                <Logo />
                {/* {
                    route === 'SignIn'
                        ? <SignIn loadUser={loadUser} changeToRoute={changeToRoute} showMessage={showMessage} />
                        : <Register loadUser={loadUser} changeToRoute={changeToRoute} showMessage={showMessage} />
                } */}
                {
                    route === 'SignIn'
                        ? <CustomForm 
                            formName='Sign In'
                            formFields={[{name: 'email', type: 'text'}, { name: 'password', type: 'password' }]}
                            onFormSubmit={onFormSubmit}
                            isLoading={isLoading}
                        />
                        : <CustomForm
                            formName='Register'
                            formFields={[{name:'name', type:'text'}, {name: 'email', type: 'text'}, { name: 'password', type: 'password' }]}
                            onFormSubmit={onFormSubmit}
                            isLoading={isLoading}
                        />
                }
                <p style={{fontSize: '1.5rem', color: '#ffbb00', fontWeight:'300'}}
                    ref={messageRef}>
                    {message}
                </p>
            </Fragment>
        );
}

export default App;
