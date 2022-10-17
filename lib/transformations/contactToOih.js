/* eslint prefer-destructuring: "off" */

function contactToOih(passedContact) {
  const metadata = {
    recordUid: String(passedContact.vid),
  };

  const contact = passedContact.properties;

  let person = false;

  if (contact.firstname || contact.lastname || contact.email) {
    person = {
      firstName: contact.firstname,
      lastName: contact.lastname,
      // gender: contact.Gender ? contact.Gender : '',
      // jobTitle: contact.Department ? contact.Department : '',
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

  if ('phone' in contact && contact.ohone !== null) {
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

  return { data: { person, organization }, metadata };
}

module.exports = {
  contactToOih,
};
