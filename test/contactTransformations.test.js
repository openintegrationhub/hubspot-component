/* eslint no-unused-expressions: "off" */
/* eslint no-tabs: "off" */

const { expect } = require('chai');
const { transform } = require('@openintegrationhub/ferryman');
const { contactToOih } = require('../lib/transformations/contactToOih');
const { contactFromOihPerson } = require('../lib/transformations/contactFromOihPerson');
const { contactFromOihOrganization } = require('../lib/transformations/contactFromOihOrganization');

describe('Person transformations', () => {
  it('should transform a person message into hubspot format', async () => {
    const msg = {
      data: {
        firstName: 'Joe',
        lastName: 'Doe',
        gender: '',
        jobTitle: 'Technical',
        nickname: '',
        displayName: '',
        middleName: '',
        salutation: 'Mr.',
        title: 'Dr.',
        birthday: '01.02.1990',
        photo: 'someUrl',
        contactData: [{
          type: 'email',
          value: 'joe@doe.com',
          description: '',
        },
        {
          type: 'fax',
          value: '123456789',
          description: '',
        },
        {
          type: 'mobile',
          value: '0177123456',
          description: '',
        }, {
          type: 'phone',
          value: '040123456',
          description: '',
        }, {
          type: 'phone',
          value: '070999999',
          description: 'Home',
        },
        {
          type: 'phone',
          value: '0401234561',
          description: 'Assistant Jane Doe',
        },
        {
          type: 'phone',
          value: '55555555',
          description: 'Other',
        },
        {
          type: 'website',
          value: 'some-site.com',
          description: 'Other',
        },
        ],
        categories: [{
          label: 'CleanStatus: 1',
        },
        {
          label: 'LeadSource: Newsletter',
        },
        {
          label: 'HasOptedOutOfFax: 0',
        },
        {
          label: 'HasOptedOutOfEmail: 0',
        }, {
          label: 'DoNotCall: 0',
        }, {
          label: 'AccountName: Account 1',
        }],
        addresses: [{
          street: 'Somestreet',
          streetNumber: '1',
          zipcode: '12345',
          city: 'Somecity',
          region: 'Somestate',
          country: 'Somecountry',
          description: '',
        }, {
          street: 'Otherstreet',
          streetNumber: '2',
          zipcode: '23450',
          city: 'Othercity',
          region: 'Otherstate',
          country: 'Othercountry',
          description: 'Other',
        }],
        relations: [],
      },
      metadata: {
        recordUid: '007',
        oihUid: 'Oih123',
      },
    };


    const expectedResponse = {
      data: {
        properties: {
          firstname: 'Joe',
          jobtitle: 'Technical',
          lastname: 'Doe',
          email: 'joe@doe.com',
          phone: '040123456',
          website: 'some-site.com',
        },
      },
      metadata: {
        recordUid: '007',
        oihUid: 'Oih123',
      },
    };

    const response = transform(msg, {}, contactFromOihPerson);

    expect(response).to.deep.equal(expectedResponse);
  });
});

describe('Organization transformations', () => {
  it('should transform a organization message into hubspot format', async () => {
    const msg = {
      data: {
        name: 'BigSomeCorp',
        contactData: [{
          type: 'email',
          value: 'joe@doe.com',
          description: '',
        },
        {
          type: 'fax',
          value: '123456789',
          description: '',
        },
        {
          type: 'mobile',
          value: '0177123456',
          description: '',
        }, {
          type: 'phone',
          value: '040123456',
          description: '',
        }, {
          type: 'phone',
          value: '070999999',
          description: 'Home',
        },
        {
          type: 'phone',
          value: '0401234561',
          description: 'Assistant Jane Doe',
        },
        {
          type: 'phone',
          value: '55555555',
          description: 'Other',
        },
        {
          type: 'website',
          value: 'some-site.com',
          description: 'Other',
        },
        ],
        categories: [{
          label: 'CleanStatus: 1',
        },
        {
          label: 'LeadSource: Newsletter',
        },
        {
          label: 'HasOptedOutOfFax: 0',
        },
        {
          label: 'HasOptedOutOfEmail: 0',
        }, {
          label: 'DoNotCall: 0',
        }, {
          label: 'AccountName: Account 1',
        }],
        addresses: [{
          street: 'Somestreet',
          streetNumber: '1',
          zipcode: '12345',
          city: 'Somecity',
          region: 'Somestate',
          country: 'Somecountry',
          description: '',
        }, {
          street: 'Otherstreet',
          streetNumber: '2',
          zipcode: '23450',
          city: 'Othercity',
          region: 'Otherstate',
          country: 'Othercountry',
          description: 'Other',
        }],
        relations: [],
      },
      metadata: {
        recordUid: '007',
        oihUid: 'Oih123',
      },
    };


    const expectedResponse = {
      data: {
        properties: {
          company: 'BigSomeCorp',
          email: 'joe@doe.com',
          phone: '040123456',
          website: 'some-site.com',
        },
      },
      metadata: {
        recordUid: '007',
        oihUid: 'Oih123',
      },
    };

    const response = transform(msg, {}, contactFromOihOrganization);

    expect(response).to.deep.equal(expectedResponse);
  });
});

describe('Contact transformations', () => {
  it('should transform a full message into OIH format', async () => {
    const contact = {
      id: '111',
      properties: {
        company:	'Somecompany',
        createdate:	'2019-10-30T03:30:17.883Z',
        email:	'js@some.com',
        firstname:	'John',
        lastmodifieddate:	'2019-12-07T16:50:06.678Z',
        lastname:	'Smith',
        phone:	'(123) 456789',
        website:	'some.com',
        jobtitle: 'Assistant',
      },
    };

    const expectedResponse = {
      data: {
        person: {
          firstName: 'John',
          jobTitle: 'Assistant',
          lastName: 'Smith',
          contactData: [
            {
              type: 'email',
              value: 'js@some.com',
              description: '',
            },
            {
              type: 'phone',
              value: '(123) 456789',
              description: '',
            },
            {
              type: 'website',
              value: 'some.com',
              description: '',
            },
          ],
          categories: [],
          addresses: [],
          relations: [],
        },
        organization: {
          name: 'Somecompany',
          contactData: [
            {
              description: '',
              type: 'website',
              value: 'some.com',
            },
          ],
          categories: [],
          addresses: [],
          relations: [],
        },
      },
      metadata: { recordUid: '111' },
    };

    const response = transform(contact, {}, contactToOih);

    expect(response).to.deep.equal(expectedResponse);
  });
});
