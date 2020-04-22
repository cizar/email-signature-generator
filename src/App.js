import React, {useState, useEffect} from 'react';
import {Button, Checkbox, Dialog, Pane, SelectField, Switch, TextInputField} from 'evergreen-ui';
import QRCode from 'qrcode.react';
import Firma from './components/Firma';
import copyToClipboard, {copyStringToClipboard} from './helpers/copyToClipboard';
import createVCard from './helpers/createVCard';
import {getIdFromUrl, getDownloadUrlFromId} from './helpers/googleDrive';
import getImageSize from './helpers/getImageSize';

const {search} = window.location;
const params = new URLSearchParams(search);

const {
  REACT_APP_ORGANIZATION: DEFAULT_ORGANIZATION,
  REACT_APP_URL: DEFAULT_URL,
  REACT_APP_IMAGE_URL: DEFAULT_IMAGE_URL,
  REACT_APP_IMAGE_WIDTH: DEFAULT_IMAGE_WIDTH,
  REACT_APP_IMAGE_HEIGHT: DEFAULT_IMAGE_HEIGHT,
} = process.env;

const scales = {
  '1x': 1,
  '2x': 1/2,
  '3x': 1/3,
};

const fields = [
  {name: 'firstName', label: 'First Name'},
  {name: 'lastName', label: 'Last Name'},
  {name: 'title', label: 'Title'},
  {name: 'organization', label: 'Organization', default: DEFAULT_ORGANIZATION},
  {name: 'workEmail', label: 'Work Email'},
  {name: 'workPhone', label: 'Work Phone', hint: 'No spaces or hyphens, starting with +54 followed by the area code, e.g.: +541145671000'},
  {name: 'cellPhone', label: 'Cellular Phone', hint: 'Same as before but including 9 between country and area code, e.g.: +5491167891000'},
  {name: 'street', label: 'Street', vCardPath: 'workAddress.street'},
  {name: 'url', label: 'Web', default: DEFAULT_URL},
  {name: 'imageUrl', label: 'Image', exclude: true, default: DEFAULT_IMAGE_URL},
  {name: 'imageWidth', label: 'Width (px)', exclude: true, default: DEFAULT_IMAGE_WIDTH},
  {name: 'imageHeight', label: 'Height (px)', exclude: true, default: DEFAULT_IMAGE_HEIGHT},
];

const showGodModeOption = fields.some((field) => field.default);

const includedFieldsInitialState = ['firstName', 'lastName', 'workEmail', 'workPhone', 'cellPhone'];

const valuesInitialState = fields.reduce((prev, current) => {
  return {
    ...prev,
    [current.name]: params.has(current.name) ? params.get(current.name) : current.default || ''
  };
}, {
  scale: '2x',
  driveFileUrl: '',
});

const signatureRef = React.createRef();

function App() {
  const [copied, setCopied] = useState(null);
  const [isQrVisible, setQrVisibility] = useState(false);
  const [values, setValues] = useState(valuesInitialState);
  const [includedFields, setIncludedFields] = useState(includedFieldsInitialState);
  const [isGodMode, setGodMode] = useState(false);
  const [isDialogShown, setShowDialog] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  function setValue(name, value) {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  }
  useEffect(() => {
    const p = new URLSearchParams();
    for (var key in values) {
      p.set(key, values[key]);
    }
    window.history.replaceState(null, null, '?' + p.toString());
  });
  function handleInputChange(event) {
    const {name, value} = event.target;
    setValue(name, value);
    setCopied(null);
  }
  function handleIncludeField(field, checked) {
    setIncludedFields(prevValues => checked ? prevValues.concat(field) : prevValues.filter(e => e !== field));
  }
  function handleCopySignature() {
    copyToClipboard(signatureRef.current);
    setCopied('signature');
  }
  function handleCopyHtml() {
    copyStringToClipboard(signatureRef.current.outerHTML);
    setCopied('html');
  }
  const vCardData = fields.reduce(function(memo, field) {
    if (includedFields.indexOf(field.name) >= 0) {
      memo[field.vCardPath || field.name] = values[field.name];
    }
    return memo;
  }, {});
  const vcard = createVCard(vCardData).getFormattedString();
  return (
    <>
      <Dialog
        isShown={isDialogShown}
        title="Google Drive"
        isConfirmLoading={isImageLoading}
        onConfirm={async () => {
          const id = getIdFromUrl(values.driveFileUrl);
          if (id) {
            const imageUrl = getDownloadUrlFromId(id);
            setIsImageLoading(true);
            const {width, height} = await getImageSize(imageUrl);
            const scaleFactor = scales[values.scale];
            setValue('imageUrl', imageUrl);
            setValue('imageWidth', Math.round(width * scaleFactor));
            setValue('imageHeight', Math.round(height * scaleFactor));
            setIsImageLoading(false);
            setShowDialog(false)
          }
        }}
        onCloseComplete={() => setShowDialog(false)}
        confirmLabel="Use image"
      >
        <TextInputField
          label="Image Public Link"
          name="driveFileUrl"
          value={values.driveFileUrl}
          onChange={handleInputChange}
          autoFocus
        />
        <SelectField
          label="Scale"
          name="scale"
          value={values.scale}
          onChange={handleInputChange}
        >
          {Object.entries(scales).map(([scale]) => (
            <option key={scale} value={scale}>{scale}</option>
          ))}
        </SelectField>
      </Dialog>
      
      <Pane display="flex" flexDirection="row">

        <Pane padding={15} width={360}>
          {fields.filter(field => isGodMode || !field.default).map((item, index) => (
            <div key={index} style={{display: 'flex', flexDirection: 'row'}}>
              <div style={{flex: 1}}>
                <TextInputField
                  label={item.label}
                  name={item.name}
                  value={values[item.name]}
                  onChange={handleInputChange}
                  hint={item.hint}
                  autoFocus={index === 0}
                />
              </div>
              {!item.exclude && isQrVisible && (
                <div style={{marginLeft: '12px', marginTop: '15px'}}>
                  <Checkbox
                    tabIndex={-1}
                    label="Add to QR"
                    checked={includedFields.indexOf(item.name) !== -1}
                    onChange={(e) => handleIncludeField(item.name, e.target.checked)}
                  />
                </div>
              )}
            </div>
          ))}
          {showGodModeOption && (
            <Switch
              checked={isGodMode}
              onChange={(e) => setGodMode(e.target.checked)}
            />
          )}
        </Pane>

        <Pane padding={15} flex={1}>

          <Pane marginBottom={30}>
            <Button
              appearance={copied === 'signature' ? 'primary' : 'default'}
              intent={copied === 'signature' ? 'success' : 'none'}
              iconBefore={copied === 'signature' ? 'tick' : 'clipboard'}
              onClick={handleCopySignature}
            >
                {copied === 'signature' ? 'Copied' : 'Copy signature'}
            </Button>
            <Button
              appearance={copied === 'html' ? 'primary' : 'default'}
              intent={copied === 'html' ? 'success' : 'none'}
              iconBefore={copied === 'html' ? 'tick' : 'clipboard'}
              onClick={handleCopyHtml}
              marginLeft={16}
            >
              {copied === 'html' ? 'Copied' : 'Copy HTML'}
            </Button>
            <Button
              appearance="default"
              iconBefore={'document'}
              onClick={() => setShowDialog(true)}
              marginLeft={16}
            >
              Select Image
            </Button>
            <Button
              appearance="default"
              iconBefore={isQrVisible ? 'eye-off' : 'eye-open'}
              onClick={() => setQrVisibility(!isQrVisible)}
              marginLeft={16}
            >
              {isQrVisible ? 'Hide QR' : 'Show QR'}
            </Button>

          </Pane>

          <Pane clearfix style={{ marginBottom: 15 }}>
            <Pane border="muted" float="left" backgroundColor="white" padding={8}>
              <Firma ref={signatureRef} {...values} />
            </Pane>
          </Pane>

          {isQrVisible && (
            <Pane backgroundColor="white" padding={16}>
              <QRCode value={vcard} size={240} />
              <pre>{vcard}</pre>
            </Pane>
          )}

        </Pane>        
      </Pane>
    </>
  );
}

export default App;
