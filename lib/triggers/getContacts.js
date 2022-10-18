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

    snapshot.lastUpdated = new Date(snapshot.lastUpdated).getTime() || new Date(0).getTime();

    if (cfg.devMode) console.log(snapshot);

    const contacts = await getContacts(cfg, snapshot);

    if (cfg.devMode) console.log('contacts', JSON.stringify(contacts));

    const { length } = contacts;
    for (let i = 0; i < length; i += 1) {
      const updatedAt = new Date(contacts[i].properties.lastmodifieddate).getTime();
      if (updatedAt > snapshot.lastUpdated) snapshot.lastUpdated = updatedAt;
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
        this.emit('data', personMessage);
      }

      if (transformedMessage.data.organization) {
        const organizationMessage = {
          data: transformedMessage.data.organization,
          metadata: transformedMessage.metadata,
        };
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
