/* eslint no-param-reassign: "off" */
/* eslint consistent-return: "off" */


const { transform } = require('@openintegrationhub/ferryman');
const { upsertOrganization, getAccessToken, deleteObject } = require('./../utils/helpers');
const { contactFromOihOrganization } = require('../transformations/contactFromOihOrganization');

/**
 * This method will be called from OIH platform providing following data
 *
 * @param {Object} msg - incoming message object that contains ``data`` with payload
 * @param {Object} cfg - configuration that is account information and configuration field values
 */
async function processAction(msg, cfg) {
  try {
    cfg.accessToken = await getAccessToken(cfg);

    if (!cfg || !cfg.accessToken) {
      throw new Error('No access token!');
    }

    if (msg.data.deleteRequested) {
      if (cfg.deletes) {
        const res = await deleteObject(msg, cfg, 'Account');

        if (!res) return false;

        const response = {
          metadata: msg.metadata,
          data: {
            delete: res.status,
            timestamp: res.timestamp,
          },
        };

        return this.emit('data', response);
      }
      return console.warn('Delete requested but component is not configured to allow deletes');
    }

    const transformedMessage = transform(msg, cfg, contactFromOihOrganization);

    if (cfg.devMode) console.log('transformedMessage', JSON.stringify(transformedMessage));

    const response = await upsertOrganization(transformedMessage, cfg);

    if (cfg.devMode) console.log('response', response);

    this.emit('data', response);
  } catch (e) {
    console.error('ERROR: ', e);
    this.emit('error', e);
  }
}

module.exports = {
  process: processAction,
};
