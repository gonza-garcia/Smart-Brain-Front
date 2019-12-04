import React, {Fragment} from 'react';
import './Navigation.css';

const Navigation = ({ changeToRoute, isSignedIn, user }) => {
    return (
      <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
          {
              isSignedIn
              ? <Fragment>
                    <p onClick={() => changeToRoute('Profile')}>{user.name.replace(/^\w/, c => c.toUpperCase())}</p>
                    <p onClick={() => changeToRoute('SignOut')}>Sign Out</p>
                </Fragment>
              : <Fragment>
                    <p onClick={() => changeToRoute('SignIn')}>Sign In</p>
                    <p onClick={() => changeToRoute('Register')}>Register</p>
                </Fragment>
          }
      </nav>
    );
}

export default Navigation;