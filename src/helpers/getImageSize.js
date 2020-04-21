const getImageSize = (url) =>  new Promise((resolve, reject) => {
  var img = new Image();
  img.onload = function() {
    const {width, height} = this;
    resolve({width, height});
  };
  img.onerror = reject;
  img.src = url;
});

export default getImageSize;