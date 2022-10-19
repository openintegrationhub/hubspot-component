/* eslint no-param-reassign: "off" */


const { transform } = require('@openintegrationhub/ferryman');
const { getContacts, getAccessToken } = require('./../utils/helpers');
const { contactToOih } = require('../transformations/contactToOih');

/**
 * This method will be called from OIH platform providing following data
 *
 * @param {Object} msg - incoming message object that contains ``body`` with payload
 * @param {Object} cfg - configuration that is account information and configuration field values
 */
async function processAction(msg, cfg, snapshot = {}) {
  try {
    cfg.accessToken = await getAccessToken(cfg);

    if (!cfg || !cfg.accessToken) {
      throw new Error('No access token!');
    }

    if (cfg.devMode) console.log('Fetching snapshot');

    snapshot.lastUpdatedContacts = new Date(snapshot.lastUpdatedContacts).getTime() || new Date(0).getTime();
    snapshot.lastUpdatedCompanies = new Date(snapshot.lastUpdatedCompanies).getTime() || new Date(0).getTime();

    if (cfg.devMode) console.log(snapshot);

    const res = await getContacts(cfg, snapshot);
    const contacts = res.entries;

    const updatedAtContacts = new Date(res.contactDate).getTime();
    const updatedAtCompanies = new Date(res.companiesDate).getTime();
    if (updatedAtContacts > snapshot.lastUpdatedContacts) snapshot.lastUpdatedContacts = updatedAtContacts;
    if (updatedAtCompanies > snapshot.lastUpdatedCompanies) snapshot.lastUpdatedCompanies = updatedAtCompanies;

    if (cfg.devMode) console.log('contacts', JSON.stringify(contacts));

    const { length } = contacts;
    for (let i = 0; i < length; i += 1) {
      // const updatedAt = new Date(contacts[i].properties.lastmodifieddate).getTime();
      // if (updatedAt > snapshot.lastUpdated) snapshot.lastUpdated = updatedAt;
      const transformedMessage = transform(contacts[i], cfg, contactToOih);

      if (cfg.devMode) {
        console.log('transformedMessage');
        console.log(JSON.stringify(transformedMessage));
      }

      if (transformedMessage.data.person) {
        const personMessage = {
          data: transformedMessage.data.person,
          metadata: transformedMessage.metadata,
        };
        console.log('personMessage', personMessage);
        this.emit('data', personMessage);
      }

      if (transformedMessage.data.organization) {
        const organizationMessage = {
          data: transformedMessage.data.organization,
          metadata: transformedMessage.metadata,
        };
        console.log('organizationMessage', organizationMessage);
        this.emit('data', organizationMessage);
      }
    }

    this.emit('snapshot', snapshot);
  } catch (e) {
    console.error('ERROR: ', e);
    this.emit('error', e);
  }
}

module.exports = {
  process: processAction,
};
