import { Fragment } from 'react';
import './Button.css';

const Button = ({ text, onClick, width }) => {
    return <Fragment>
                <label
                    className='form-button'
                    style={{width: width}}
                    onClick={onClick} 
                >
                    {text}
                </label>
          </Fragment>
}

export default Button;