// Import the useDropzone hooks from react-dropzone
import { useDropzone } from "react-dropzone";

const Dropzone = ({ onDrop, accept }) => {
    // Initializing useDropzone hooks with options
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept
    });

    const pmessage = isDragActive ? `Release to drop the files here` : `Drag 'n' drop some files here, or click to select files`;

    /* 
      useDropzone hooks exposes two functions called getRootProps and getInputProps
      and also exposes isDragActive boolean
    */

    return (
        <div {...getRootProps()}>
            <input className="dropzone-input" {...getInputProps()} />
            <div className="text-center">
                <p className="dropzone-content">
                    { pmessage }
                </p>
            </div>
        </div>
    );
};

export default Dropzone;