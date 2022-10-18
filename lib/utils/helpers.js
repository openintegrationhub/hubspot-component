/* eslint no-await-in-loop: "off" */
/* eslint consistent-return: "off" */

const request = require('request-promise').defaults({ simple: false, resolveWithFullResponse: true });

const hubspot = require('@hubspot/api-client');

const secretServiceApiEndpoint = process.env.SECRET_SERVICE_ENDPOINT || 'https://secret-service.openintegrationhub.com';

async function deleteObject(msg, cfg) {
  try {
    // basePath: 'https://some-url'
    const hubspotClient = new hubspot.Client({ accessToken: cfg.accessToken });

    if (!msg.metadata || !msg.metadata.recordUid) {
      console.error('Tried to delete, but was not passed a recordUid!');
      return false;
    }

    // /crm/v3/objects/contacts/gdpr-delete
    const result = await hubspotClient.crm.contacts.basicApi.delete(msg.metadata.recordUid);

    if (cfg.devMode) console.log('result', result);

    let status = 'failed';
    if (result.deleted && result.deleted === true) status = 'confirmed';

    return {
      status,
      timestamp: Date.now(),
    };
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function upsertContact(msg, cfg) {
  try {
    if (cfg.devMode) console.log('accessToken', cfg.accessToken);
    const hubspotClient = new hubspot.Client({ accessToken: cfg.accessToken });

    if (cfg.devMode) console.log(hubspotClient);

    let id = false;
    if (msg.metadata && msg.metadata.recordUid) {
      id = msg.metadata.recordUid;
    }

    if (cfg.devMode) console.log(id);

    let result = false;
    const newData = msg.data;
    if (id) {
      if (cfg.devMode) console.log('newData', newData);

      result = await hubspotClient.crm.contacts.basicApi.update(id, newData);

      if (cfg.devMode) console.log('result', result);

      if (result === false) {
        result = await hubspotClient.crm.contacts.basicApi.create(newData);

        if (cfg.devMode) console.log('result', result);
      }
    } else {
      result = await hubspotClient.crm.contacts.basicApi.create(newData);
    }

    if (cfg.devMode) {
      console.log(typeof result);
      if (Array.isArray(result)) {
        console.log(result.length);
        console.log(result[0]);
      } else {
        console.log(JSON.stringify(result));
      }
    }

    if (result !== false) {
      const newMeta = msg.metadata;
      newMeta.recordUid = String(result.vid);
      if (msg.metadata.oihUid) newMeta.oihUid = msg.metadata.oihUid;
      return { metadata: newMeta };
    }

    return false;
  } catch (e) {
    console.error(e);
    return {};
  }
}

async function getContacts(cfg, snapshot) { // , snapshot
  try {
    if (cfg.devMode) console.log('accessToken', cfg.accessToken);
    const hubspotClient = new hubspot.Client({ accessToken: cfg.accessToken });

    if (cfg.devMode) console.log(hubspotClient);

    const lastUpdated = new Date(snapshot.lastUpdated); // .toISOString();

    console.log('snapshot', snapshot);

    // const allContacts = await hubspotClient.crm.contacts.getAll()

    const query = '';
    // const properties = ['createdate', 'firstname', 'lastname']
    const filter = { propertyName: 'lastmodifieddate', operator: 'GTE', value: `${lastUpdated + 1}` };
    const filterGroup = { filters: [filter] };
    const sort = JSON.stringify({ propertyName: 'lastmodifieddate', direction: 'ASCENDING' });
    const limit = 100;
    const after = 0;

    const searchRequest = {
      filterGroups: [filterGroup],
      sorts: [sort],
      query,
      // properties,
      limit,
      after,
    };

    const result = await hubspotClient.crm.contacts.searchApi.doSearch(searchRequest);
    if (cfg.devMode) console.log(JSON.stringify(result));

    let hubspotDate = snapshot.lastUpdated;
    if (Array.isArray(result) && result.length > 0) {
      hubspotDate = result[result.length - 1].properties.lastmodifieddate;
    }

    if (cfg.devMode) console.log('hubspotDate', hubspotDate);

    if (cfg.devMode) {
      console.log(typeof result);
      if (Array.isArray(result)) {
        console.log(result.length);
        console.log(result[0]);
      } else {
        console.log(JSON.stringify(result));
      }
    }

    if (result) return result;

    return [];
  } catch (e) {
    console.error(e);
    return [];
  }
}


async function getAccessToken(config) {
  try {
    if (config.accessToken) {
      return config.accessToken;
    }

    const response = await request({
      method: 'GET',
      uri: `${secretServiceApiEndpoint}/secrets/${config.secret}`,
      headers: {
        'x-auth-type': 'basic',
        authorization: `Bearer ${config.iamToken}`,
      },
      json: true,
    });

    const { value } = response.body;
    return value.accessToken;
  } catch (e) {
    console.log(e);
    return e;
  }
}


module.exports = {
  upsertContact,
  getContacts,
  getAccessToken,
  secretServiceApiEndpoint,
  deleteObject,
};
