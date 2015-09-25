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
var tableName = "Customers" + guid.v1().replace(/-/g,'');

var entityGen = storage.TableUtilities.entityGenerator;
var storageClient = storage.createTableService(readConfig().connectionString);

/**
* Azure Table Service Sample - Demonstrate how to perform common tasks using the Microsoft Azure Table storage 
* including creating a table, CRUD operations, batch operations and different querying techniques. 
* 
* Documentation References: 
* - What is a Storage Account - http://azure.microsoft.com/en-us/documentation/articles/storage-whatis-account/
* - Getting Started with Tables - https://azure.microsoft.com/en-us/documentation/articles/storage-nodejs-how-to-use-table-storage/
* - Table Service Concepts - http://msdn.microsoft.com/en-us/library/dd179463.aspx
* - Table Service REST API - http://msdn.microsoft.com/en-us/library/dd179423.aspx
* - Table Service Node API - http://azure.github.io/azure-storage-node/TableService.html
* - Storage Emulator - http://msdn.microsoft.com/en-us/library/azure/hh403989.aspx
*/ 
runAzureTableSamples();

function runAzureTableSamples(){
    /**
    *  Instructions: This sample can be run using either the Azure Storage Emulator that installs as part of this SDK - or by
    *  updating the config.json file with your AccountName and Key. 
    *   
    *  To run the sample using the Storage Emulator (default option)
    *       1. Start the Azure Storage Emulator (once only) by pressing the Start button or the Windows key and searching for it
    *          by typing "Azure Storage Emulator". Select it from the list of applications to start it.
    *  To run the sample using the Storage Service
    *       1. Open the config.json file and update storage account information (see step 2 for creating an account if you don't already have one.)
    *       2. Create a Storage Account through the Azure Portal and provide your STORAGE_NAME and STORAGE_KEY in 
    *          the config.json file. See http://go.microsoft.com/fwlink/?LinkId=325277 for more information
    *       3. Run application through Node.js command prompt by running command "npm start"
    *  
    */
    
    console.log("Azure Storage Table Sample\n");
    console.log("1. Create a Table for the demo");
    
    // Create or reference an existing table (Table name is provided in config.json and can be updated)
    if(storageClient.createTableIfNotExists(tableName, function tableCreated(error) {
        if(error) {
            console.log("   If you are running with the default configuration please make sure you have started the storage emulator. Press the Windows key and type Azure Storage to select and run it from the list of applications - then restart the sample.");
          throw error;
        } else {
            console.log("2. Inserting or updating an entity using insertOrMergeEntity function.");
            var customer = createCustomerEntityDescriptor("Harp", "Walter", "Walter@contoso.com", "425-555-0101");

            storageClient.insertOrMergeEntity(tableName, customer, function (error, result, response) {
                if (error) {
                    throw error;
                } else {
                    console.log("   insertOrMergeEntity succeeded.");
                    console.log("3. Reading the updated entity.");

                    // Demonstrate the most efficient storage query - the point query - where both partition key and row key are specified. 
                    storageClient.retrieveEntity(tableName, customer.PartitionKey._, customer.RowKey._, function (error, result) {
                        if (error) {
                            throw error;
                        } else {
                            console.log("   retrieveEntity succeeded: ", result.PartitionKey._, result.RowKey._, result.email._, result.phone._);
                            console.log("4. Deleting the entity. ");

                            storageClient.deleteEntity(tableName, customer, function entitiesQueried(error, result) {
                                if (error) {
                                    throw error;
                                } else {
                                    console.log("   deleteEntity succeeded.");

                                    // Demonstrates upsert and batch table operations
                                    console.log("5. Inserting a batch of entities. ");

                                    // create batch operation
                                    var batch = new storage.TableBatch();
                                    var lastName = "Smith";

                                    // The following code  generates test data for use during the query samples.  
                                    for (var i = 0; i < 100; i++) {

                                        var name = zeroPaddingString(i, 4);
                                        var customerToInsert = createCustomerEntityDescriptor(lastName, name, name + "@contoso.com", "425-555-" + name)

                                        batch.insertEntity(customerToInsert);
                                    }

                                    //  Demonstrate inserting of a large batch of entities. Some considerations for batch operations:
                                    //  1. You can perform updates, deletes, and inserts in the same single batch operation.
                                    //  2. A single batch operation can include up to 100 entities.
                                    //  3. All entities in a single batch operation must have the same partition key.
                                    //  4. While it is possible to perform a query as a batch operation, it must be the only operation in the batch.
                                    //  5. Batch size must be <= 4MB    
                                    storageClient.executeBatch(tableName, batch, function (error, result, response) {
                                        if (error) {
                                            throw error;
                                        } else {
                                            console.log("   Batch insert completed.");
                                            console.log("6. Retrieving entities with surname of Smith and first names >= 1 and <= 75");

                                            var storageTableQuery = storage.TableQuery;
                                            var pageSize = 50;
                                            // Demonstrate a partition range query whereby we are searching within a partition for a set of entities that are within a specific range. 
                                            var tableQuery = new storageTableQuery().where('PartitionKey eq ?', lastName).and('RowKey gt ?', "0001").and('RowKey le ?', "0075");

                                            runPageQuery(pageSize, tableQuery, null, function () {
                                                
        
                                                // Demonstrate a partition scan whereby we are searching for all the entities within a partition. 
                                                // Note this is not as efficient as a range scan - but definitely more efficient than a full table scan. 
                                                console.log("7. Retrieve entities with surname of %s.", lastName);
                                                var tableQuery = new storageTableQuery().where('PartitionKey eq ?', lastName);

                                                runPageQuery(pageSize, tableQuery, null, deleteTable);
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
    }
    })) {

        console.log("   Created Table: ", tableName);
    } else {
        console.log("   Table already exists: ", tableName);
    }
}

/** 
* Running a table query with specific page size and continuationToken
* @ignore 
* 
* @param {int}                        pageSize            Number of entities returned by single query 
* @param {TableQuery}                tableQuery            Query to execute
* @param {TableContinuationToken}    continuationToken    Continuation token to continue a query
* @param {function}                    callback            Additional sample operations to run after this one completes   
*/ 
function runPageQuery(pageSize, tableQuery, continuationToken, callback){
    
    tableQuery.TakeCount = pageSize;
    storageClient.queryEntities(tableName, tableQuery, continuationToken, function (error, result) { 
        if(error) {
            throw error;
        } else {
            var entities = result.entries; 
            entities.forEach(function (entity) { 
                console.log("    Customer: %s,%s,%s,%s",entity.PartitionKey._, entity.RowKey._, entity.email._, entity.phone._)
            }); 
            
            continuationToken = result.continuationToken; 
               if(continuationToken) { 
                runPageQuery(pageSize, partitionKey, rowKeyStart, rowKeyEnd, continuationToken); 
               } else { 
                console.log("   Query completed.");
                callback();
               } 
        }
    });
}

/**
* Deletes the table used in this sample. 
* @ignore 
* 
*/ 
function deleteTable(){

    storageClient.deleteTable(tableName, function(error, response){
        if(error) {
            throw error;
        } else {
            console.log("   deleteTable succeeded.");
        }
    });
}

/**
* Adds paddings to a string. 
* @ignore 
* 
* @param {string}     str                          The input string. 
* @param {int}        len                          The length of the string. 
* @return {string} 
*/ 
function zeroPaddingString(str, len) { 
    var paddingStr = '0000000000' + str; 
    if(paddingStr.length < len) { 
        return zeroPaddingString(paddingStr, len); 
    } else { 
        return paddingStr.substr(-1 * len); 
    } 
} 

/**
* Reads the configurations.
* @ignore
*
* @return {Object}
*/
function readConfig() {
  var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
  if (config.useDevelopmentStorage) {
    config.connectionString = storage.generateDevelopmentStorageCredendentials();
  }
  return config;
}

/**
* Creates a customer entity to be used in library calls based on provided parameters
* @ignore
*
* @param {string}    partitionKey    Last name of the customer 
* @param {string}    rowKey            Name of the customer
* @param {string}    email            Email of the customer
* @param {string}    phone              Phone number of the customer
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
