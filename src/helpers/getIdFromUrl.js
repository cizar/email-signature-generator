function getIdFromUrl(url) {
  return url.match(/[-\w]{25,}/);
}

export default getIdFromUrl;