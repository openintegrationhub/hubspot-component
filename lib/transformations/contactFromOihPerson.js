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
  contactFromOihPerson,
};
