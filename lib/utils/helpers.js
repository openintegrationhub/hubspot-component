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

    // if (cfg.devMode) console.log(hubspotClient);

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
      newMeta.recordUid = String(result.id);
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

    // if (cfg.devMode) console.log(hubspotClient);

    const lastUpdatedContacts = parseInt(snapshot.lastUpdatedContacts, 10);
    const lastUpdatedCompanies = parseInt(snapshot.lastUpdatedCompanies, 10);

    console.log('snapshot', snapshot);

    // const allContacts = await hubspotClient.crm.contacts.getAll()

    const query = '';

    const properties = [
      'firstname',
      'lastname',
      'name',
      'industry',
      'phone',
      'state',
      'address',
      'city',
      'zip',
      'email',
      'lastmodifieddate',
      'lifecylestage',
      'hs_leadstatus',
      'company',
      'createdate',
      'website',
      'jobtitle',
    ];

    const filter = { propertyName: 'lastmodifieddate', operator: 'GT', value: lastUpdatedContacts };
    const filterGroup = { filters: [filter] };
    const sort = JSON.stringify({ propertyName: 'lastmodifieddate', direction: 'ASCENDING' });
    const limit = 100;
    const after = 0;


    const searchRequest = {
      filterGroups: [filterGroup],
      sorts: [sort],
      query,
      properties,
      limit,
      after,
    };

    let result = await hubspotClient.crm.contacts.searchApi.doSearch(searchRequest);
    if (cfg.devMode) console.log(JSON.stringify(result));
    if (result && 'results' in result) result = result.results;

    // Fetching companies that are independent of a person
    searchRequest.filterGroups[0].filters[0].propertyName = 'hs_lastmodifieddate';
    searchRequest.filterGroups[0].filters[0].value = lastUpdatedCompanies;
    searchRequest.sorts[0].propertyName = 'hs_lastmodifieddate';
    let companyResult = await hubspotClient.crm.companies.searchApi.doSearch(searchRequest);
    if (cfg.devMode) console.log(JSON.stringify(companyResult));
    if (companyResult && 'results' in companyResult) companyResult = companyResult.results;


    let contactDate = snapshot.lastUpdatedContacts;
    if (Array.isArray(result) && result.length > 0) {
      contactDate = result[result.length - 1].properties.lastmodifieddate;
    }

    let companiesDate = snapshot.lastUpdatedCompanies;
    if (Array.isArray(companyResult) && companyResult.length > 0) {
      companiesDate = companyResult[companyResult.length - 1].properties.hs_lastmodifieddate;

      for (let i = 0; i < companyResult.length; i += 1) {
        companyResult[i].properties.lastmodifieddate = companyResult[i].properties.hs_lastmodifieddate;
      }
      result = result.concat(companyResult);
      result.sort((a, b) => a.properties.lastmodifieddate - b.properties.lastmodifieddate);
    }

    if (cfg.devMode) {
      console.log('contactDate', contactDate);
      console.log('companiesDate', companiesDate);
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

    if (result) return { entries: result, contactDate, companiesDate };

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
