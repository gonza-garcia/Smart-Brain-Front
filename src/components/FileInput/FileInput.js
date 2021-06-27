import { Fragment } from 'react';
import './FileInput.css';

const FileInput = ({ text, name, id, onChange, width }) => {
    return (
        <Fragment>
            <label
                htmlFor={id}
                className='fileInputLabel'
                style={{width: width}}>
                {text}
            </label>
            <input 
                type="file"
                name={name}
                id={id}
                onChange={onChange}
                className='fileInput'
                />
            {/* <input
                name='fileInput'
                className="form-button"
                id="browseForAdd"
                type="file"
                onChange={onChange}
                /> */}
        </Fragment>
    );
}

export default FileInput;