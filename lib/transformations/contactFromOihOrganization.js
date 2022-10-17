/* eslint prefer-destructuring: "off" */

function contactFromOihOrganization(msg) {
  let email = '';
  let phone = '';
  let mobile = '';
  let fax = '';
  let website = '';

  let index;
  if (msg.data.contactData) {
    const contactData = msg.data.contactData;
    // eslint-disable-next-line no-restricted-syntax
    for (index in msg.data.contactData) {
      if (contactData[index].type === 'email') {
        if (email === '') email = contactData[index].value;
      } else if (contactData[index].type === 'phone') {
        if (phone === '') {
          phone = contactData[index].value;
        }
      } else if (contactData[index].type === 'mobile' || contactData[index].type === 'mobil') {
        if (mobile === '') {
          mobile = contactData[index].value;
        }
      } else if (contactData[index].type === 'website') {
        if (website === '') {
          website = contactData[index].value;
        }
      } else if (contactData[index].type === 'fax') {
        if (fax === '') {
          fax = contactData[index].value;
        }
      }
    }
  }

  if (phone === '' && mobile !== '') phone = mobile;

  // let siteAddress = '';
  // if (msg.data.addresses && msg.data.addresses.length > 0) {
  //   const adr = msg.data.addresses[0];
  //   siteAddress = `${adr.street ? adr.street : ''} ${adr.streetNumber ? adr.streetNumber : ''}
  //             ${adr.zipcode ? adr.zipcode : ''} ${adr.city ? adr.city : ''}
  //             ${adr.district ? adr.district : ''} ${adr.country ? adr.country : ''}`;
  // }


  const contact = {
    properties: {
      company: msg.data.name ? msg.data.name : `Company ${msg.data.uid ? msg.data.uid : ''}`,
      email,
      phone,
      website,
    },
  };

  //
  // if (msg.data.addresses && Array.isArray(msg.data.addresses)) {
  //   index = 0;
  //   if (msg.data.addresses[index]) {
  //     const address = {
  //       City: msg.data.addresses[index].city,
  //       Country: msg.data.addresses[index].country,
  //       GeocodeAccuracy: null,
  //       Latitude: null,
  //       Longitude: null,
  //       PostalCode: msg.data.addresses[index].zipcode,
  //       State: msg.data.addresses[index].region,
  //       Street: `${msg.data.addresses[index].street} ${msg.data.addresses[index].streetNumber}`,
  //     };
  //
  //     let key;
  //     // eslint-disable-next-line
  //     for (key in address) {
  //       account[`Shipping${key}`] = address[key];
  //     }
  //   }
  //
  //   index = 1;
  //   if (msg.data.addresses[index]) {
  //     const address = {
  //       City: msg.data.addresses[index].city,
  //       Country: msg.data.addresses[index].country,
  //       GeocodeAccuracy: null,
  //       Latitude: null,
  //       Longitude: null,
  //       PostalCode: msg.data.addresses[index].zipcode,
  //       State: msg.data.addresses[index].region,
  //       Street: `${msg.data.addresses[index].street} ${msg.data.addresses[index].streetNumber}`,
  //     };
  //     let key;
  //     // eslint-disable-next-line
  //     for (key in address) {
  //       account[`Billing${key}`] = address[key];
  //     }
  //   }
  // }

  // if (msg.metadata.recordUid) contact.vid = msg.metadata.recordUid;

  return { data: contact, metadata: msg.metadata };
}

module.exports = {
  contactFromOihOrganization,
};
