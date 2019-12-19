import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = React.forwardRef(({ imageUrl, boxes }, ref) => {
  return (
      <div className='image-div'>
          <img 
            className='main-image'
            alt=''
            src={imageUrl}
            ref={ref}
            />
          {
              boxes.map((box, i) => 
                    <div 
                        key={i}
                        className='bounding-box'
                        style={{top:    box.topRow,
                                right:  box.rightCol,
                                bottom: box.bottomRow,
                                left:   box.leftCol}}
                    ></div>
              )
          }
      </div>
  );
});

export default FaceRecognition;