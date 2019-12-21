import React from 'react';
import './ImageLinkForm.css';
import Button from '../Button/Button.js';
import FileInput from '../FileInput/FileInput.js';

const ImageLinkForm = React.forwardRef(({ onInputChange, onImageUpload, onDetect, onClear, isLoading }, ref) => {
    const textForDetect = isLoading ? 'Working... Please Wait' : 'Detect';

    return (
            <form
                className='image-link-form'
                ref={ref}
                >
                <textarea 
                    name='textInput'
                    className='form-textarea'
                    placeholder={`Copy your pic's url here or upload your own and click Detect.`}
                    rows='3'
                    onChange={onInputChange}>
                </textarea>
                <FileInput 
                    text='Upload Pic'
                    name='fileInput'
                    id='fileInputLabel'
                    onChange={onImageUpload}
                    width='50%'
                    />
                <Button text='Clear' onClick={onClear} width='50%'/>
                <Button text={textForDetect} onClick={onDetect} width='100%'/>
            </form>
    );
});

export default ImageLinkForm;