import React from 'react';
import parsePhoneNumber from '../helpers/parsePhoneNumber';

const styles = {
  table: {
    borderCollapse: 'collapse',
  },
  cell: {
    fontFamily: 'sans-serif',
    fontSize: '11px',
    lineHeight: '17px',
    color: 'black',
    align: 'left',
  }
};

const Firma = React.forwardRef(({firstName, lastName, title, organization, workEmail, url, workPhone, cellPhone, street, imageUrl, imageWidth, imageHeight}, ref) => {
  const fullName = [firstName, lastName].join(' ').toUpperCase();
  const displayUrl = url.replace(/^https?:\/\//,'');
  return (
    <table ref={ref} style={styles.table} cellPadding="7" cellSpacing="0">
      <tbody>
        <tr>
          {!!imageUrl && (
            <td valign="top">
              <img src={imageUrl} alt={organization} border="0" width={imageWidth} height={imageHeight} style={{ width: imageWidth, height: imageHeight }} />
            </td>
          )}
          <td valign="top" style={styles.cell}>
            {!!fullName && <><strong>{fullName}</strong><br /></>}
            {!!title && <>{title}<br /></>}
            {!!workEmail && <><a href={`mailto:${workEmail}`}>{workEmail}</a><br /></>}
            {!!workPhone && <>{parsePhoneNumber(workPhone, 'international')}<br /></>}
            {!!cellPhone && <>{parsePhoneNumber(cellPhone, 'international')}<br /></>}
            {!!street && <>{street}<br /></>}
            {!!url && <><a href={url}>{displayUrl}</a></>}
          </td>
        </tr>
      </tbody>
    </table>
  );
});

export default Firma;
