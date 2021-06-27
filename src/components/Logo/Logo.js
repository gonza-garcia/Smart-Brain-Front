import React, {Fragment} from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import brainLogo from './brain.png';

const Logo = () => {
    return (
        <Fragment>
            <Tilt className="logo-div Tilt-inner" options={{ max : 65, perspective: 250, scale: 1.35 }}>
                <img
                    src={brainLogo}
                    alt='brain logo'
                    width='100%'
                    />
            </Tilt>
        </Fragment>
    );
}

export default Logo;