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

  if (msg.data.addresses && Array.isArray(msg.data.addresses) && msg.data.addresses.length > 0) {
    contact.properties.city = `${msg.data.addresses[0].city}`;
    contact.properties.zip = `${msg.data.addresses[0].zipcode}`;
    contact.properties.state = `${msg.data.addresses[0].country}`;
    contact.properties.address = `${msg.data.addresses[0].street} ${msg.data.addresses[0].streetNumber}`;
  }

  // if (msg.metadata.recordUid) contact.id = msg.metadata.recordUid;

  return { data: contact, metadata: msg.metadata };
}

module.exports = {
  contactFromOihOrganization,
};
