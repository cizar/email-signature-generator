export const getIdFromUrl = (url) => url.match(/[-\w]{25,}/);  
export const getDownloadUrlFromId = (id) => `https://drive.google.com/uc?id=${id}`;
