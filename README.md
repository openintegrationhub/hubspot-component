![alpha](https://img.shields.io/badge/Status-Alpha-yellow.svg)

# Hubspot Connector

> Hubspot Connector for Open Integration Hub.


## Data model
This connector transforms to and from the hubspot contact data model, using these fields:

contact:
```json
{
  vid: '111',
  properties: {
    company:	'Somecompany',
    createdate:	'2019-10-30T03:30:17.883Z',
    email:	'js@some.com',
    firstname:	'John',
    lastmodifieddate:	'2019-12-07T16:50:06.678Z',
    lastname:	'Smith',
    phone:	'(123) 456789',
    website:	'some.com',
  },
}
```

## Usage

1. Create api client with hubspot
2. Set redirect uri to https://app.yourservice.com/callback/oauth2
3. Set contacts:read contacts:write addresses:read addresses:write
4. Set register secret in secret service
5. Add secret to flow step
6. Add instanceUrl to flow step *

\* The instanceUrl is provided from hubspot as return value from the oauth2 login. So you might want to extend the secret service to add the value to the flow step automatically.

(The url might look like: https://your-hubspot-id.my.hubspot...)

## Actions

### upsertContact
This action will upsert a contact in Hubspot. If an ID is supplied, the connector will attempt to update an existing contact with this ID. If no ID is provided a new entry will be created instead.

## Triggers

### getContacts
This trigger will get all person and organization (contact's) from the associated Hubspot account and pass them forward. By default it will only fetch the first 100000 entries.

## Integrated Transformations

By default, this connector attempts to automatically transform data to and from the OIH Address Master Data model. If you would like to use your own transformation solution, simply set `skipTransformation: true` in the `fields` object of your flow configuration. Alternatively, you can also inject a valid, stringified JSONata expression in the `customMapping` key of the `fields` object, which will be used instead of the integrated transformation.
