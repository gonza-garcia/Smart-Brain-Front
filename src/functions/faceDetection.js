// Face detection using face-api.js
let modelsLoaded = false;

export const loadModels = async () => {
    if (modelsLoaded || !window.faceapi) {
        return modelsLoaded;
    }
    
    try {
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
        
        await Promise.all([
            window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            window.faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        
        modelsLoaded = true;
        console.log('✅ Face detection models loaded');
        return true;
    } catch (error) {
        console.error('❌ Error loading face detection models:', error);
        return false;
    }
};

export const detectFaces = async (imageUrl) => {
    if (!window.faceapi) {
        console.error('face-api.js not loaded');
        return [];
    }

    if (!modelsLoaded) {
        await loadModels();
    }

    try {
        // Create an image element
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        return new Promise((resolve, reject) => {
            img.onload = async () => {
                try {
                    const detections = await window.faceapi
                        .detectAllFaces(img, new window.faceapi.TinyFaceDetectorOptions())
                        .withFaceLandmarks();
                    
                    // Convert to Clarifai-like format for compatibility
                    const boxes = detections.map(detection => {
                        const box = detection.detection.box;
                        const imageWidth = img.width;
                        const imageHeight = img.height;
                        
                        return {
                            region_info: {
                                bounding_box: {
                                    top_row: box.y / imageHeight,
                                    left_col: box.x / imageWidth,
                                    bottom_row: (box.y + box.height) / imageHeight,
                                    right_col: (box.x + box.width) / imageWidth
                                }
                            }
                        };
                    });
                    
                    resolve(boxes);
                } catch (error) {
                    reject(error);
                }
            };
            
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = imageUrl;
        });
    } catch (error) {
        console.error('Error detecting faces:', error);
        return [];
    }
};
