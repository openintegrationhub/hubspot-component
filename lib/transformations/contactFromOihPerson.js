/* eslint prefer-destructuring: "off" */

function contactFromOihPerson(msg) {
  let email = '';
  let phone = '';
  let homephone = '';
  let otherphone = '';
  let mobilephone = '';
  let assistantphone = '';
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
        if (contactData[index].description
          && contactData[index].description.toLowerCase() === 'home'
        ) {
          homephone = contactData[index].value;
        } else if (phone === '') {
          phone = contactData[index].value;
        } else if (homephone === '') {
          homephone = contactData[index].value;
        } else if (assistantphone === '') {
          assistantphone = contactData[index].value;
        } else if (otherphone === '') {
          otherphone = contactData[index].value;
        }
      } else if (contactData[index].type === 'mobile' || contactData[index].type === 'mobil') {
        if (mobilephone === '') {
          mobilephone = contactData[index].value;
        }
      } else if (contactData[index].type === 'fax') {
        if (fax === '') {
          fax = contactData[index].value;
        }
      } else if (contactData[index].type === 'website') {
        if (website === '') {
          website = contactData[index].value;
        }
      }
    }
  }

  const contact = {
    properties: {
      firstname: msg.data.firstName ? msg.data.firstName : '',
      lastname: msg.data.lastName ? msg.data.lastName : '',
      jobtitle: msg.data.jobTitle ? msg.data.jobTitle : '',
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
  //       contact[`Mailing${key}`] = address[key];
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
  //
  //     let key;
  //     // eslint-disable-next-line
  //     for (key in address) {
  //       contact[`Other${key}`] = address[key];
  //     }
  //   }
  // }


  // if (msg.metadata.recordUid) contact.vid = msg.metadata.recordUid;

  return { data: contact, metadata: msg.metadata };
}

module.exports = {
  contactFromOihPerson,
};
