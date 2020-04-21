import PhoneNumber from 'awesome-phonenumber';

function parsePhoneNumber (value, format) {
  const pn = new PhoneNumber(value);
  return pn.getNumber(format);
}

export default parsePhoneNumber;
