//----------------------------------------------------------------------------------
// Microsoft Developer & Platform Evangelism
//
// Copyright (c) Microsoft Corporation. All rights reserved.
//
// THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, 
// EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES 
// OF MERCHANTABILITY AND/OR FITNESS FOR A PARTICULAR PURPOSE.
//----------------------------------------------------------------------------------
// The example companies, organizations, products, domain names,
// e-mail addresses, logos, people, places, and events depicted
// herein are fictitious.  No association with any real company,
// organization, product, domain name, email address, logo, person,
// places, or events is intended or should be inferred.
//----------------------------------------------------------------------------------

var fs = require('fs');
var guid = require('node-uuid');
var storage = require('azure-storage');
var config = require('./config.js');

var entityGen;
var tableService;

function AdvancedAzureTableSamples() {
  entityGen = storage.TableUtilities.entityGenerator;
  tableService = storage.createTableService(config.connectionString);

   scenarios = [
    {
      action: listAllTables,
      message: 'Azure Table List Sample\n'
    },
    {
      action: tableOperationsWithSas,
      message: 'Azure Table Operations with SAS\n'
    }
  ];

  advancedAzureStorageTablesScenarios = [
    {
      action: corsRules,
      message: 'Table CORS Sample\n'
    },
    {
      action: serviceProperties,
      message: 'Table Service Properties Sample\n'
    },
    {
      action: tableAcl,
      message: 'Table Access Policy Sample\n'
    }
  ];
 
  allScenarios = scenarios
  if (!config.connectionString.includes('table.cosmosdb')){
    allScenarios = scenarios.concat(advancedAzureStorageTablesScenarios);
  }
  return allScenarios;
}


function listAllTables(callback) {
  tableService.createTableIfNotExists("Advanced" + guid.v1().replace(/-/g, ''), function (error, created) {
    if (error) return callback(error);

    tableService.createTableIfNotExists("Advanced" + guid.v1().replace(/-/g, ''), function (error, created) {
      if (error) return callback(error);

      listTables('Advanced', tableService, null, { maxResults: 100 }, null, function (error, tables) {
        if (error) return callback(error);

        tables.forEach(function (table) {
          console.log("Table: " + table);

          tableService.deleteTable(table, null, function (error) {
            if (!error) console.log('Table ' + table + ' deleted.');

            return callback(error);
          })
        })
      })
    })
  })
};

function tableOperationsWithSas(callback) {
  // Create or reference an existing table
  var tableName = "Customers" + guid.v1().replace(/-/g, ''); 
  tableService.createTableIfNotExists(tableName, function tableCreated(error, createResult) {
    if (error) return callback(error);

    if (createResult.isSuccessful) {
      console.log("1. Create Table operation executed successfully for: ", tableName);
    }

    var expiryDate = new Date();

    expiryDate.setMinutes(expiryDate.getMinutes() + 30);

    var sharedAccessPolicy = {
      AccessPolicy: {
        Permissions: storage.TableUtilities.SharedAccessPermissions.QUERY
        + storage.TableUtilities.SharedAccessPermissions.ADD
        + storage.TableUtilities.SharedAccessPermissions.UPDATE
        + storage.TableUtilities.SharedAccessPermissions.DELETE,
        Expiry: expiryDate
      },
    };

    var sas = tableService.generateSharedAccessSignature(tableName, sharedAccessPolicy);

    var sharedTableService = storage.createTableServiceWithSas(tableService.host, sas);

    console.log("2. Inserting or updating an entity with Shared Access Signature.");
    var customer = createCustomerEntityDescriptor("Harp", "Walter", "Walter@contoso.com", "425-555-0101");

    sharedTableService.insertOrMergeEntity(tableName, customer, function (error, result, response) {
      if (error) return callback(error);

      console.log("   insertOrMergeEntity succeeded.");

      console.log("3. Reading the updated entity with Shared Access Signature.");

      // Demonstrate the most efficient storage query - the point query - where both partition key and row key are specified. 
      sharedTableService.retrieveEntity(tableName, customer.PartitionKey._, customer.RowKey._, function (error, result) {
        if (error) return callback(error);

        console.log("   retrieveEntity succeeded: ", result.PartitionKey._, result.RowKey._, result.email._, result.phone._);

        console.log("4. Deleting the entity with Shared Access Signature. ");

        sharedTableService.deleteEntity(tableName, customer, function entitiesQueried(error, result) {
          if (error) return callback(error);

          console.log("   deleteEntity succeeded.");

          console.log('5. Deleting table');
          tableService.deleteTable(tableName, function (error) {
            callback(error);
          });
        });
      });
    });
  });
};


// Get Cors properties, change them and revert back to original
function corsRules(callback) {

  console.log('Get service properties');
  tableService.getServiceProperties(function (error, properties) {
    if (error) return callback(error);

    console.log('Set Cors rules in the service properties');

    // Keeps the original Cors rules
    var originalCors = properties.Cors;

    properties.Cors = {
      CorsRule: [{
        AllowedOrigins: ['*'],
        AllowedMethods: ['POST', 'GET', 'HEAD', 'PUT'],
        AllowedHeaders: ['*'],
        ExposedHeaders: ['*'],
        MaxAgeInSeconds: 3600
      }]
    };

    tableService.setServiceProperties(properties, function (error) {
      if (error) return callback(error);

      console.log('Cors rules set successfuly');

      // reverts the cors rules back to the original ones so they do not get corrupted by the ones set in this sample
      properties.Cors = originalCors;

      tableService.setServiceProperties(properties, function (error) {
        return callback(error);
      });

    });
  });
}


// Manage logging and metrics service properties
function serviceProperties(callback) {
  // Create a blob client for interacting with the blob service from connection string
  // How to create a storage connection string - http://msdn.microsoft.com/en-us/library/azure/ee758697.aspx
  var blobService = storage.createBlobService(config.connectionString);

  console.log('Get service properties');
  blobService.getServiceProperties(function (error, properties) {
    if (error) return callback(error);

    var originalProperties = properties;

    properties = serviceProperties = {
      Logging: {
        Version: '1.0',
        Delete: true,
        Read: true,
        Write: true,
        RetentionPolicy: {
          Enabled: true,
          Days: 10,
        },
      },
      HourMetrics: {
        Version: '1.0',
        Enabled: true,
        IncludeAPIs: true,
        RetentionPolicy: {
          Enabled: true,
          Days: 10,
        },
      },
      MinuteMetrics: {
        Version: '1.0',
        Enabled: true,
        IncludeAPIs: true,
        RetentionPolicy: {
          Enabled: true,
          Days: 10,
        },
      }
    };

    console.log('Set service properties');
    blobService.setServiceProperties(properties, function (error) {
      if (error) return callback(error);

      // reverts the service properties back to the original ones so they do not get corrupted by the ones set in this sample
      blobService.setServiceProperties(originalProperties, function (error) {
        return callback(error);
      });
    });
  });
}

// Retrieve statistics related to replication for the Table service
function serviceStats(callback) {
  
  console.log('Get service statistics');
  tableService.getServiceStats(function (error, serviceStats){
    if (error) return callback(error);

    callback(null);
  });

}

// Manage access policies of the table
function tableAcl(callback) {
  var tableName = "AclTable" + guid.v1().replace(/-/g, '');
  console.log('Create table');
  tableService.createTableIfNotExists(tableName, function() {
    
    // Set access policy
    var expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 10);

    var sharedAccessPolicy = {
      sampleIDForTablePolicy: {
        Permissions: storage.TableUtilities.SharedAccessPermissions.PROCESS,
        Expiry: expiryDate
      }
    };

    console.log('Set table access policy');
    tableService.setTableAcl(tableName, sharedAccessPolicy, function (error, result, response) {
      if (error) return callback(error);

      // Get access policy
      console.log('Get table access policy');
      tableService.getTableAcl(tableName, function(error, result, response) {
        if (error) return callback(error);

        console.log(' Permissions: ' + result.signedIdentifiers.sampleIDForTablePolicy.Permissions);
        console.log(' Expiry: ' + result.signedIdentifiers.sampleIDForTablePolicy.Expiry.toISOString());

        console.log('Delete table');
        tableService.deleteTable(tableName, function () {
          callback(error);
        });
      });
    });
  });
}



/**
* Lists tables in the container.
* @ignore
*
* @param {string}             prefix                              The prefix of the table name.
* @param {TableService}       tableService                        The table service client.
* @param {object}             token                               A continuation token returned by a previous listing operation. 
*                                                                 Please use 'null' or 'undefined' if this is the first operation.
* @param {object}             [options]                           The request options.
* @param {int}                [options.maxResults]                Specifies the maximum number of tables to return per call to Azure ServiceClient. 
*                                                                 This does NOT affect list size returned by this function. (maximum: 5000)
* @param {errorOrResult}      callback                            `error` will contain information
*                                                                 if an error occurs; otherwise `result` will contain `entries` and `continuationToken`. 
*                                                                 `entries`  gives a list of tables and the `continuationToken` is used for the next listing operation.
*                                                                 `response` will contain information related to this operation.
*/
function listTables(prefix, tableService, token, options, tables, callback) {
  tables = tables || [];

  tableService.listTablesSegmentedWithPrefix(prefix, token, options, function (error, result) {

    if (error) return callback(error, null);

    tables.push.apply(tables, result.entries);

    var token = result.continuationToken;

    if (token) {
      console.log('   Received a segment of results. There are ' + result.entries.length + ' tables on this segment.');
      listTables(prefix, tableService, token, options, callback);
    } else {
      console.log('   Completed listing. There are ' + tables.length + ' tables.');
      callback(null, tables);
    }
  })
}

/**
* Creates a customer entity to be used in library calls based on provided parameters
* @ignore
*
* @param {string}  partitionKey     Last name of the customer 
* @param {string}  rowKey           Name of the customer
* @param {string}  email            Email of the customer
* @param {string}  phone            Phone number of the customer
* @return {Object}
*/
function createCustomerEntityDescriptor(partitionKey, rowKey, email, phone) {
  var customerEntity = {
    PartitionKey: entityGen.String(partitionKey),
    RowKey: entityGen.String(rowKey),
    email: entityGen.String(email),
    phone: entityGen.String(phone)
  };
  return customerEntity;
}

module.exports = AdvancedAzureTableSamples();