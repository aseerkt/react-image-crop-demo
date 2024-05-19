import React, { useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { drawImageOnCanvas, generateDownload } from './utils';

export default function App() {
  const [imgSrc, setImgSrc] = useState();
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);

  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCompleteCrop = (crop) => {
    drawImageOnCanvas(imgRef.current, canvasRef.current, crop);
    setCompletedCrop(crop);
  };

  const handleDownload = () => {
    generateDownload(canvasRef.current, completedCrop);
  };

  // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
  const canvasStyles = {
    width: Math.round(completedCrop?.width ?? 0),
    height: Math.round(completedCrop?.height ?? 0),
  };

  return (
    <div className='App'>
      <div className='FileSelector'>
        <input
          id='file'
          type='file'
          accept='image/*'
          onChange={handleFileSelect}
          placeholder='Choose file'
        />
      </div>

      <div className='CropperWrapper'>
        <ReactCrop
          crop={crop}
          onChange={setCrop}
          aspect={1}
          onComplete={handleCompleteCrop}
        >
          {imgSrc && <img ref={imgRef} src={imgSrc} alt='cropper image' />}
        </ReactCrop>
        {!imgSrc && <p className='InfoText'>Choose file to crop</p>}
        <div className='CanvasWrapper'>
          {/* Canvas to display cropped image */}
          <canvas ref={canvasRef} style={canvasStyles} />
        </div>
      </div>

      <div>
        <p>
          Note that the download below won't work in this sandbox due to the
          iframe missing 'allow-downloads'. It's just for your reference.
        </p>
        <button
          type='button'
          disabled={!completedCrop}
          onClick={handleDownload}
        >
          Download cropped image
        </button>
      </div>
    </div>
  );
}
