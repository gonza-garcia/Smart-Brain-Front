import { useState } from 'react';
import { fetch_from_server } from '../../functions/functions.js';

const Register = ({ loadUser, changeToRoute, showMessage }) => {

    const [ name, setName ]           = useState('');
    const [ email, setEmail ]         = useState('');
    const [ password, setPassword ]   = useState('');
    const [ isLoading, setIsLoading ] = useState(false);


    const onSubmitRegister = async event => {
        event.preventDefault();

        setIsLoading(true);

        try 
        {
            const user = await fetch_from_server('/register', { email, password, name }, 'post');

            if (user.id) 
            {
                loadUser(user);
                changeToRoute('Home');
            }

        }
        catch (error) {
            const msg = (typeof error === 'string')
                                ? error
                                : 'Wrong credentialS. Please try again';

                                console.log(error);

            setIsLoading(false);

            showMessage(msg);
        }
    }


    return (
        <article className="br3 ba b--black-10 mv4 shadow-5 center" style={{maxWidth: '20rem'}}>
            <form className="pa4 black-80" style={{position: 'relative'}}>
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">
                            Register
                        </legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="name">
                                Name
                            </label>
                            <input 
                                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                type="text"
                                name="name"
                                id="name" 
                                autoComplete='name'
                                onChange={event => setName(event.target.value)}
                            />
                        </div>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email">
                                Email
                            </label>
                            <input 
                                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                type="email"
                                name="email"  
                                id="email" 
                                autoComplete='email'
                                onChange={event => setEmail(event.target.value)}
                            />
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">
                                Password
                            </label>
                            <input 
                                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                type="password"
                                name="password" 
                                id="password"
                                autoComplete='new-password'
                                onChange={event => setPassword(event.target.value)}
                            />
                        </div>
                    </fieldset>
                    <div className="">
                        <input
                            onClick={onSubmitRegister}
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                            type="submit"
                            value={!isLoading ? 'Register' : 'Please wait...'}
                            />
                    </div>
                    <div className="lh-copy mt3">
                        <p
                            onClick={() => changeToRoute('SignIn')}
                            className="f6 link dim black db pointer">
                                ...or Sign In
                        </p>
                    </div>
                </div>
            </form>
        </article>
    );
}

export default Register;