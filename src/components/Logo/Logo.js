import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import brainLogo from './brain-80.png';

const Logo = () => {
    return (
        <div className='ma3 mt0'>
            <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 150, width: 150 }} >
                <div className='Tilt-inner pa3'>
                    <img style={{paddingTop: '5px'}} src={brainLogo} alt='brain logo'></img>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;