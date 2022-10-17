// /* eslint no-unused-expressions: "off" */
//
// const { expect } = require('chai');
// const nock = require('nock');
// const { upsertContact, getContacts } = require('../lib/utils/helpers');
//
// describe('Upsert Contact', () => {
//   it('should insert a contact if none is found', async () => {
//     nock('https://api.hubspot.com/contacts/', {
//       reqheaders: {
//         authorization: 'Bearer aTestKey',
//       },
//     })
//       .get('/nonexistentuid')
//       .reply(404, {});
//
//     nock('https://api.hubspot.com/contacts/', {
//       reqheaders: {
//         authorization: 'Bearer aTestKey',
//       },
//     })
//       .post('', {
//         id: '12345',
//         name: 'Jane Doe',
//         family: 'Doe',
//         given: 'Jane',
//         picture: 'some picture',
//         emails: [
//           {
//             email: 'jdoe@mail.com',
//             type: [
//               'string1',
//             ],
//           },
//         ],
//         numbers: [
//           {
//             number: '13579',
//             type: [
//               'string2',
//             ],
//           },
//         ],
//         addresses: [
//           {
//             poBox: 'p/o',
//             extendedAddress: 'extended',
//             streetAddress: 'Somestreet 42',
//             locality: 'Somecity',
//             region: 'Someregion',
//             postalCode: '22123',
//             country: 'Somecountry',
//           },
//         ],
//         organization: [
//           [
//             'Wice',
//           ],
//         ],
//         scope: 'PRIVATE',
//       })
//       .reply(201, {
//         id: '12345',
//         name: 'Jane Doe',
//         family: 'Doe',
//         given: 'Jane',
//         picture: 'some picture',
//         emails: [
//           {
//             email: 'jdoe@mail.com',
//             type: [
//               'string1',
//             ],
//           },
//         ],
//         numbers: [
//           {
//             number: '13579',
//             type: [
//               'string2',
//             ],
//           },
//         ],
//         addresses: [
//           {
//             poBox: 'p/o',
//             extendedAddress: 'extended',
//             streetAddress: 'Somestreet 42',
//             locality: 'Somecity',
//             region: 'Someregion',
//             postalCode: '22123',
//             country: 'Somecountry',
//           },
//         ],
//         organization: [
//           [
//             'Wice',
//           ],
//         ],
//         scope: 'PRIVATE',
//       });
//
//
//     const msg = {
//       data: {
//         id: '12345',
//         name: 'Jane Doe',
//         family: 'Doe',
//         given: 'Jane',
//         picture: 'some picture',
//         emails: [
//           {
//             email: 'jdoe@mail.com',
//             type: [
//               'string1',
//             ],
//           },
//         ],
//         numbers: [
//           {
//             number: '13579',
//             type: [
//               'string2',
//             ],
//           },
//         ],
//         addresses: [
//           {
//             poBox: 'p/o',
//             extendedAddress: 'extended',
//             streetAddress: 'Somestreet 42',
//             locality: 'Somecity',
//             region: 'Someregion',
//             postalCode: '22123',
//             country: 'Somecountry',
//           },
//         ],
//         organization: [
//           [
//             'Wice',
//           ],
//         ],
//         scope: 'PRIVATE',
//       },
//       metadata: {
//         recordUid: undefined,
//         oihUid: 'TestOihUid',
//       },
//     };
//
//     const cfg = {
//       accessToken: 'aTestKey',
//     };
//
//     const response = await upsertContact(msg, cfg);
//
//     expect(response.metadata.recordUid).to.equal('12345');
//     expect(response.metadata.oihUid).to.equal('TestOihUid');
//   });
//
//   it('should update a contact if id is provided', async () => {
//     nock('https://api.hubspot.com/v2/contacts', {
//       // reqheaders: {
//       //   authorization: 'Bearer aTestKey',
//       // "accept": "application/json",
//       // "content-type": "application/json",
//       // "content-length": 417
//       // },
//     })
//       .put('/12345', {
//         id: '12345',
//         name: 'Jane Doe',
//         family: 'Doe',
//         given: 'Jane',
//         picture: 'some picture',
//         emails: [
//           {
//             email: 'jdoe@mail.com',
//             type: [
//               'string1',
//             ],
//           },
//         ],
//         numbers: [
//           {
//             number: '13579',
//             type: [
//               'string2',
//             ],
//           },
//         ],
//         addresses: [
//           {
//             poBox: 'p/o',
//             extendedAddress: 'extended',
//             streetAddress: 'Somestreet 42',
//             locality: 'Somecity',
//             region: 'Someregion',
//             postalCode: '22123',
//             country: 'Somecountry',
//           },
//         ],
//         organization: [
//           [
//             'Wice',
//           ],
//         ],
//         scope: 'PRIVATE',
//       })
//       .reply(200, {
//         id: '12345',
//         name: 'Jane Doe',
//         family: 'Doe',
//         given: 'Jane',
//         picture: 'some picture',
//         emails: [
//           {
//             email: 'jdoe@mail.com',
//             type: [
//               'string1',
//             ],
//           },
//         ],
//         numbers: [
//           {
//             number: '13579',
//             type: [
//               'string2',
//             ],
//           },
//         ],
//         addresses: [
//           {
//             poBox: 'p/o',
//             extendedAddress: 'extended',
//             streetAddress: 'Somestreet 42',
//             locality: 'Somecity',
//             region: 'Someregion',
//             postalCode: '22123',
//             country: 'Somecountry',
//           },
//         ],
//         organization: [
//           [
//             'Wice',
//           ],
//         ],
//         scope: 'PRIVATE',
//       });
//
//
//     const msg = {
//       data: {
//         name: 'Jane Doe',
//         family: 'Doe',
//         given: 'Jane',
//         picture: 'some picture',
//         emails: [
//           {
//             email: 'jdoe@mail.com',
//             type: [
//               'string1',
//             ],
//           },
//         ],
//         numbers: [
//           {
//             number: '13579',
//             type: [
//               'string2',
//             ],
//           },
//         ],
//         addresses: [
//           {
//             poBox: 'p/o',
//             extendedAddress: 'extended',
//             streetAddress: 'Somestreet 42',
//             locality: 'Somecity',
//             region: 'Someregion',
//             postalCode: '22123',
//             country: 'Somecountry',
//           },
//         ],
//         organization: [
//           [
//             'Wice',
//           ],
//         ],
//         scope: 'PRIVATE',
//       },
//       metadata: {
//         recordUid: '12345',
//         oihUid: 'AnotherTestOihUid',
//       },
//     };
//
//     const cfg = {
//       accessToken: 'aTestKey',
//     };
//
//     const response = await upsertContact(msg, cfg);
//
//     expect(response.metadata.recordUid).to.equal('12345');
//     expect(response.metadata.oihUid).to.equal('AnotherTestOihUid');
//   });
// });
//
// describe('Get Contacts', () => {
//   it('should get a list of all contacts', async () => {
//     nock('https://api.hubspot.com', {
//       reqheaders: {
//         authorization: 'Bearer aTestKey',
//         host: 'api.hubspot.com',
//         accept: 'application/json',
//       },
//     })
//       .get('/v2/contacts?limit=100000&offset=0')
//       // .query({
//       //   limit: 100000,
//       //   offset: 0,
//       // })
//       .reply(200, {
//         items: [
//           { id: 1, name: 'Jane Doe' }, // updated: '2018-08-16T11:42:47.000+02:00'
//           { id: 2, name: 'Joe Doe' }, // updated: '2018-08-17T11:42:47.000+02:00'
//           { id: 3, name: 'Sunny Doe' }, // updated: '2018-08-18T11:42:47.000+02:00'
//         ],
//       });
//
//     // , { lastUpdated: new Date('2018-08-16T13:00:00.000+02:00').getTime() }
//     const response = await getContacts({ accessToken: 'aTestKey' });
//
//     expect(response).to.have.lengthOf(3);
//     expect(response[0].id).to.equal(1);
//     expect(response[1].id).to.equal(2);
//     expect(response[2].id).to.equal(3);
//
//     // expect(response).to.have.lengthOf(2);
//     // expect(response[0].id).to.equal(2);
//     // expect(response[1].id).to.equal(3);
//   });
// });
