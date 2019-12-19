// const host = 'http://localhost:3000';
const host = 'https://murmuring-woodland-01911.herokuapp.com';

export const get_from_server = async (added, object) => {
  const response  = await fetch(host + added, object);
  const json_response = await response.json();

  return new Promise((resolve, reject) => {
      response.ok ? resolve(json_response) : reject(json_response);
  });
}


export const get_api_data = async (url, object) => {
    const response  = await fetch(url, object);
    const json_response = await response.json();

    return new Promise((resolve, reject) => {
      response.ok ? resolve(json_response) : reject(json_response);
  });
}


export const loadImage = (url, img = new Image(), timeout = 5000) => {
  return new Promise((resolve, reject) => {
      let timer;

      img.onerror = img.onabort = () => {
          clearTimeout(timer);
          reject(`Sorry, that doesn't look like a valid pic.`);
      };
      img.onload = () => {
          clearTimeout(timer);
          resolve(`It's an image`);
      };
      timer = setTimeout(() => {
          // reset .src to invalid URL so it stops previous
          // loading, but doesn't trigger new load
          img.src = "//!!!!/test.jpg";
          reject(`Oops! There's been some kind of error. Please try again.`);
      }, timeout);
      img.src = url;
  });
}

export const loadLocalImage = (url) => {
    // To bypass errors (“Tainted canvases may not be exported” or “SecurityError: The operation is insecure”)
    // The browser must load the image via non-authenticated request and following CORS headers
    let img = new Image();
    img.crossOrigin = 'Anonymous';

    // The magic begins after the image is successfully loaded
    img.onload = () => {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');

        canvas.height = img.naturalHeight;
        canvas.width = img.naturalWidth;
        ctx.drawImage(img, 0, 0);

        // Unfortunately, we cannot keep the original image type, so all images will be converted to PNG
        // For this reason, we cannot get the original Base64 string
        let uri = canvas.toDataURL('image/png');
        let b64 = uri.replace(/^data:image.+;base64,/, '');

        return b64; //-> "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWP4z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg=="
    };

    // If you are loading images from a remote server, be sure to configure “Access-Control-Allow-Origin”
    // For example, the following image can be loaded from anywhere.
    // let url = '//cdn.static.base64.guru/uploads/images/1x1.gif';
    img.src = url;
}

export const is_url = (str) =>
{
  const regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        
  return regexp.test(str);
}