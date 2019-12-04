import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = React.forwardRef(({ onInputChange, onDetect, onClear, message }, ref) => {

    return (
            <form className='image-link-form'>
                <textarea 
                    className='form-textarea'
                    placeholder={`Paste an image url here and click on Detect.`}
                    rows='3'
                    onChange={onInputChange} 
                    ref={ref}></textarea>
                <input
                    className='form-button'
                    onClick={onDetect}
                    value='Detect'
                    type='submit' 
                    />
                <input
                    className='form-button'
                    onClick={onClear}
                    value='Clear'
                    type='reset'
                    />
                <p>{message}</p>
            </form>
    );
});

export default ImageLinkForm;