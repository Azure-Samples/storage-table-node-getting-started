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

  return scenarios = [
    {
      action: listAllTables,
      message: 'Azure Table Advanced Sample\n'
    }
  ];
}

function listAllTables(callback) {
  tableService.createTableIfNotExists("Advanced" + guid.v1().replace(/-/g, ''), function (error, created) {
    if (error) return callback(error);

    tableService.createTableIfNotExists("Advanced" + guid.v1().replace(/-/g, ''), function (error, created) {
      if (error) return callback(error);

      listTables(tableService, null, { maxResults: 100 }, null, function (error, tables) {
        if (error) return callback(error);

        tables.forEach(function (table) {
          console.log("Table: " + table);

          tableService.deleteTable(table, null, function (error) {
            if (!error) console.log('Table ' + table + ' deleted.');
          })
        })
      })
    })
  })
};

/**
* Lists tables in the container.
* @ignore
*
* @param {TableService}       tableService                        The table service client.
* @param {object}             token                               A continuation token returned by a previous listing operation. 
*                                                                 Please use 'null' or 'undefined' if this is the first operation.
* @param {object}             [options]                           The request options.
* @param {int}                [options.maxResults]                Specifies the maximum number of directories to return per call to Azure ServiceClient. 
*                                                                 This does NOT affect list size returned by this function. (maximum: 5000)
* @param {errorOrResult}      callback                            `error` will contain information
*                                                                 if an error occurs; otherwise `result` will contain `entries` and `continuationToken`. 
*                                                                 `entries`  gives a list of tables and the `continuationToken` is used for the next listing operation.
*                                                                 `response` will contain information related to this operation.
*/
function listTables(tableService, token, options, tables, callback) {
  tables = tables || [];

  tableService.listTablesSegmented(token, options, function (error, result) {

    if (error) return callback(error, null, tableService);

    tables.push.apply(tables, result.entries);

    var token = result.continuationToken;

    if (token) {
      console.log('   Received a page of results. There are ' + result.entries.length + ' tables on this page.');
      listTables(tableService, token, options, callback);
    } else {
      console.log('   Completed listing. There are ' + tables.length + ' tables.');
      callback(null, tables);
    }
  })
}

module.exports = AdvancedAzureTableSamples();