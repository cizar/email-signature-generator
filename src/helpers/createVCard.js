import vCardsJS from 'vcards-js';
import objectPath from 'object-path';

const createVCard = (data) => {
  var vCard = vCardsJS();
  vCard.version = '3.0';
  for (var key in data) {
    objectPath.set(vCard, key, data[key]);
  }
  return vCard;
}

export default createVCard;
