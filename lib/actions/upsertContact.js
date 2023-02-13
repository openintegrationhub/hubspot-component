/* eslint no-param-reassign: "off" */
/* eslint consistent-return: "off" */

const { upsertContact, getAccessToken, getMetadata } = require('./../utils/helpers');

/**
 * This method will be called from OIH platform providing following data
 *
 * @param {Object} msg - incoming message object that contains ``data`` with payload
 * @param {Object} cfg - configuration that is account information and configuration field values
 */
async function processAction(msg, cfg) {
  try {
    const isVerbose = process.env.debug || cfg.verbose;
    cfg.accessToken = await getAccessToken(cfg);

    if (!cfg || !cfg.accessToken) {
      throw new Error('No access token!');
    }

    if (isVerbose) {
      console.log(`---MSG: ${JSON.stringify(msg)}`);
      console.log(`---CFG: ${JSON.stringify(cfg)}`);
      console.log(`---ENV: ${JSON.stringify(process.env)}`);
    }


    const response = await upsertContact(msg.data, cfg);

    const newElement = {};

    newElement.metadata = getMetadata(msg.metadata);
    newElement.data = response;
    this.emit('data', newElement);
  } catch (e) {
    console.error('ERROR: ', e);
    this.emit('error', e);
  }
}

module.exports = {
  process: processAction,
};
