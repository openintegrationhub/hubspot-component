/* eslint prefer-destructuring: "off" */

function contactToOih(passedContact) {
  const metadata = {
    recordUid: String(passedContact.id),
  };

  const contact = Object.assign({}, passedContact.properties);

  let person = false;

  if ((contact.firstname || contact.lastname || contact.email) && !contact.name) {
    person = {
      firstName: contact.firstname,
      lastName: contact.lastname,
      // gender: contact.Gender ? contact.Gender : '',
      jobTitle: contact.jobtitle ? contact.jobtitle : '',
      // nickname: '',
      // displayName: '',
      // middleName: '',
      // salutation: contact.Salutation ? contact.Salutation : '',
      // title: contact.Title ? contact.Title : '',
      // birthday: contact.Birthdate ? contact.Birthdate : '',
      // eslint-disable-next-line no-nested-ternary
      // photo: (contact.Picture ? contact.Picture : (contact.PhotoUrl ? contact.PhotoUrl : '')),
      contactData: [],
      categories: [],
      addresses: [],
      relations: [],
    };
  }

  let organization = false;

  if (contact.company && contact.company !== null) {
    organization = {
      name: contact.company,
      contactData: [],
      categories: [],
      addresses: [],
      relations: [],
    };
  } else if (contact.name && contact.name !== null) {
    organization = {
      name: contact.name,
      contactData: [],
      categories: [],
      addresses: [],
      relations: [],
    };
  }

  if ('email' in contact && contact.email !== null) {
    if (person !== false) {
      person.contactData.push({
        type: 'email',
        value: contact.email,
        description: '',
      });
    }
  }

  if ('phone' in contact && contact.phone !== null) {
    if (person !== false) {
      person.contactData.push({
        type: 'phone',
        value: contact.phone,
        description: '',
      });
    } else if (organization !== false) {
      organization.contactData.push({
        type: 'phone',
        value: contact.phone,
        description: '',
      });
    }
  }

  if ('website' in contact && contact.website !== null) {
    if (person !== false) {
      person.contactData.push({
        type: 'website',
        value: contact.website,
        description: '',
      });
    }

    if (organization !== false) {
      organization.contactData.push({
        type: 'website',
        value: contact.website,
        description: '',
      });
    }
  }

  let street = '';
  let streetNumber = '';
  let zipcode = '';
  let city = '';
  let state = '';
  if ('address' in contact && contact.address !== null) {
    const address = `${contact.address}`.trim().split(' ');
    streetNumber = address.pop();
    street = address.join(' ');
  }
  if ('city' in contact && contact.city !== null) {
    city = `${contact.city}`;
  }
  if ('state' in contact && contact.state !== null) {
    state = `${contact.state}`;
  }
  if ('zip' in contact && contact.zip !== null) {
    zipcode = `${contact.zip}`;
  }

  if (street !== '' || streetNumber !== '' || zipcode !== '' || state !== '' || zipcode !== '') {
    if (person !== false) {
      person.addresses.push({
        street,
        streetNumber,
        zipcode,
        city,
        country: state,
      });
    }

    if (organization !== false) {
      organization.addresses.push({
        street,
        streetNumber,
        zipcode,
        city,
        country: state,
      });
    }
  }


  if ('lifecylestage' in contact && contact.lifecylestage !== null) {
    if (person !== false) {
      person.categories.push({
        label: `${contact.lifecylestage}`,
      });
    }
  }

  if ('hs_leadstatus' in contact && contact.hs_leadstatus !== null) {
    if (person !== false) {
      person.categories.push({
        label: `${contact.hs_leadstatus}`,
      });
    }
  }

  return { data: { person, organization }, metadata };
}

module.exports = {
  contactToOih,
};
