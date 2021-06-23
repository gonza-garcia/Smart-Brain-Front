import React from 'react';
import { get_from_server } from '../../functions/functions.js';

const messageRef = React.createRef();

class SignIn extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          email: '',
          password: '',
          message: '',
          isLoading: false
        }
    }

    timeoutId = null;

    onEmailChange = event => {
        this.setState({email: event.target.value})
    }

    onPasswordChange = event => {
        this.setState({password: event.target.value})
    }

    onSubmitSignIn = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try 
        {
            const user = await get_from_server('/signin', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  email: this.state.email,
                  password: this.state.password
                })
            });
            
            if (user.id) {
              this.props.loadUser(user);
              this.props.changeToRoute('Home');
            }
        }
        catch (error) {
            const message = (typeof error === 'string') ? error : 'Wrong credentials. Please try again.';

            this.setState({ isLoading: false });
            this.setState({ message: message}, () => {
                messageRef.current.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
            });
            this.timeoutId = setTimeout(() => {this.setState({ message: '' })}, 4000);
        }
    }


    componentWillUnmount() {
        clearInterval(this.timeoutId);
    }

    render() {
        const {changeToRoute} = this.props;
        return (
          <article className="br3 ba b--black-10 mv4 shadow-5 center" style={{maxWidth: '20rem'}}>
              <form className="pa4 black-80" style={{position:'relative'}}>
                  <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                      <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                      <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                        <input
                          className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                          type="email"
                          name="email-address"
                          id="email-address"
                          autoComplete='email'
                          onChange={this.onEmailChange}
                          />
                      </div>
                      <div className="mv3">
                        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                        <input
                          className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                          type="password"
                          name="password"
                          id="password"
                          autoComplete='current-password'
                          onChange={this.onPasswordChange}
                        />
                      </div>
                    </fieldset>
                    <div className="">
                      <input
                        onClick={this.onSubmitSignIn}
                        className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                        type="submit"
                        value={!this.state.isLoading ? 'Sign In' : 'Please wait...'}
                      />
                    </div>
                    <div className="lh-copy mt3">
                      <p
                        onClick={() => changeToRoute('Register')}
                        className="f6 link dim black db pointer">...or Register</p>
                    </div>
                    <p
                      style={{fontSize: '.875rem', color: '#ffbb00', position:'absolute', bottom:0, right:0, left:0, marginBottom:0}}
                      ref={messageRef}>{this.state.message}</p>
                  </div>
              </form>
          </article>
        );
    }
}

export default SignIn;