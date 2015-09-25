---
services: storage
platforms: node
author: minet
---

# Azure Storage: Tables

Demonstrates how to perform common tasks using the Microsoft Azure Table storage
including creating a table, CRUD operations, batch operations and different querying techniques.

If you don't have a Microsoft Azure subscription you can
get a FREE trial account [here](http://go.microsoft.com/fwlink/?LinkId=330212)

## Running this sample

This sample can be run using either the Azure Storage Emulator that installs as part of this SDK - or by
updating the config.json file with your account name and key.
To run the sample using the Storage Emulator (default option):

1. Download and Install the Azure Storage Emulator [here](http://azure.microsoft.com/en-us/downloads/).
2. Start the Azure Storage Emulator (once only) by pressing the Start button or the Windows key and searching for it by typing "Azure Storage Emulator". Select it from the list of applications to start it.
3. Open the app.config file and set the configuration for the emulator ("useDevelopmentStorage":true).
4. Run the sample by: node ./blobSample.js

To run the sample using the Storage Service

1. Open the app.config file and set the connection string for the emulator ("useDevelopmentStorage":false) and set the connection string for the storage service ("connectionString":"...")
2. Create a Storage Account through the Azure Portal
3. Provide your connection string for the storage service ("connectionString":"...") in the app.config file. 
4. Run the sample by: node ./blobSample.js

## More information 
 - What is a Storage Account - http://azure.microsoft.com/en-us/documentation/articles/storage-whatis-account/
 - Getting Started with Tables - http://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-how-to-use-tables/
 - Table Service Concepts - http://msdn.microsoft.com/en-us/library/dd179463.aspx
 - Table Service REST API - http://msdn.microsoft.com/en-us/library/dd179423.aspx
 - Table Service Node.js API - https://azure.microsoft.com/en-us/documentation/articles/storage-nodejs-how-to-use-table-storage
 - Storage Emulator - http://msdn.microsoft.com/en-us/library/azure/hh403989.aspx
 
