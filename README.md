---
services: storage
platforms: nodejs
author: minet-MSFT
---

# Getting Started with Azure Table Service in Node.js
Demonstrates how to perform common tasks using Azure Table storage and Azure Cosmos DB Table API 
including creating a table, CRUD operations, batch operations and different querying techniques. 

If you don't have a Microsoft Azure subscription you can 
get a FREE trial account [here](http://go.microsoft.com/fwlink/?LinkId=330212)

## Running this sample

### Azure Cosmos DB Table API

1. Go to your Azure Cosmos DB Table API instance in the Azure Portal and select 
"Connection String" in the menu, select the Read-write Keys tab and copy the value 
in the "CONNECTION STRING" field.
2. Open the app.config file and set the configuration for the emulator to false 
("useDevelopmentStorage": false) and set the connection string to the value from step 1 
("connectionString":"<Value from CONNECTION STRING field>").
3. Run the sample by: node ./tableSample.js

#### More Information
-[Introduction to Azure Cosmos DB Table API](https://docs.microsoft.com/en-us/azure/cosmos-db/table-introduction)

### Azure Table storage

This sample can be run using either the Azure Storage Emulator that installs as part of this SDK - or by
supply a connection string.

To run the sample using the Storage Emulator (default option):

1. Download and Install the Azure Storage Emulator [here](http://azure.microsoft.com/en-us/downloads/).
2. Start the Azure Storage Emulator (once only) by pressing the Start button or the Windows key and 
searching for it by typing "Azure Storage Emulator". Select it from the list of applications to start it.
3. Open the app.config file and set the configuration for the emulator ("useDevelopmentStorage":true).
4. Run the sample by: node ./tableSample.js

To run the sample using the Storage Service

1. Go to your Azure Storage account in the Azure Portal and under "SETTINGS" click on "Access keys". 
Copy either key1 or key2's "CONNECTION STRING".
2. Open the app.config file and set the configuration for the emulator to false ("useDevelopmentStorage":false) 
and set the connection string for the storage service ("connectionString":"<Value from CONNECTION STRING field>").
3. Run the sample by: node ./tableSample.js

#### More Information 
- [What is a Storage Account](http://azure.microsoft.com/en-us/documentation/articles/storage-whatis-account/)
- [Getting Started with Tables](https://azure.microsoft.com/en-us/documentation/articles/storage-nodejs-how-to-use-table-storage/)
- [Table Service Concepts](http://msdn.microsoft.com/en-us/library/dd179463.aspx)
- [Table Service REST API](http://msdn.microsoft.com/en-us/library/dd179423.aspx)
- [Table Service Node API](http://azure.github.io/azure-storage-node/TableService.html)
- [Storage Emulator](http://msdn.microsoft.com/en-us/library/azure/hh403989.aspx)
