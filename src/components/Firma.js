import React from 'react';
import styled from 'styled-components';
import parsePhoneNumber from '../helpers/parsePhoneNumber';

const Row = styled.div`
  font-family: Helvetica, Arial, san-serif;
  font-size: 11px;
  line-height: 16px;
  color: #434343;
`;

const Firma = React.forwardRef(({firstName, lastName, title, organization, workEmail, url, workPhone, cellPhone, street, imageUrl, imageWidth, imageHeight}, ref) => {
  const fullName = [firstName, lastName].join(' ').toUpperCase();
  const displayUrl = url.replace(/^https?:\/\//,'');
  return (
    <table ref={ref}>
      <tbody>
        <tr>
          {imageUrl && (
            <td valign="top">
              <img src={imageUrl} alt={organization} width={imageWidth} height={imageHeight} style={{ width: imageWidth, height: imageHeight, marginRight: 12 }} />
            </td>
          )}
          <td valign="top"style={{align: 'left'}}>
            {fullName && <Row><strong>{fullName}</strong></Row>}
            {title && <Row>{title}</Row>}
            {workEmail && <Row><a href={`mailto:${workEmail}`}>{workEmail}</a></Row>}
            {workPhone && <Row>{parsePhoneNumber(workPhone, 'international')}</Row>}
            {cellPhone && <Row>{parsePhoneNumber(cellPhone, 'international')}</Row>}
            {street && <Row>{street}</Row>}
            {url && <Row><a href={url}>{displayUrl}</a></Row>}
          </td>
        </tr>
      </tbody>
    </table>
  );
});

export default Firma;
