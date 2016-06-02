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

basicAzureTableSamples = require('./basic.js');
advancedAzureTableSamples = require('./advanced.js');

/**
* Azure Table Service Sample - Demonstrate how to perform common tasks using the Microsoft Azure Table storage 
* including creating a table, CRUD operations, batch operations and different querying techniques. 
* 
* Documentation References: 
* - What is a Storage Account - http://azure.microsoft.com/en-us/documentation/articles/storage-whatis-account/
* - Getting Started with Tables https://azure.microsoft.com/en-us/documentation/articles/storage-nodejs-how-to-use-table-storage/
* - Table Service Concepts -  http://msdn.microsoft.com/en-us/library/dd179463.aspx
* - Table Service REST API -  http://msdn.microsoft.com/en-us/library/dd179423.aspx
* - Table Service Node API -  http://azure.github.io/azure-storage-node/TableService.html
* - Storage Emulator -      http://msdn.microsoft.com/en-us/library/azure/hh403989.aspx
*/
 
runAzureTableSamples();

function runAzureTableSamples(){
  /**
  *  Instructions: This sample can be run using either the Azure Storage Emulator that installs as part of this SDK - or by
  *  updating the config.json file with your connection string
  *   
  *  To run the sample using the Storage Emulator (default option)
  *   1. Start the Azure Storage Emulator (once only) by pressing the Start button or the Windows key and searching for it
  *    by typing "Azure Storage Emulator". Select it from the list of applications to start it.
  *  To run the sample using the Storage Service
  *   1. Open the config.json file and update storage account information (see step 2 for creating an account if you don't already have one.)
  *   2. Create a Storage Account through the Azure Portal and provide your connection string in 
  *    the config.json file. 
  *   3. Run application through Node.js command prompt by running command "npm start"
  *  
  */
  console.log('\nAzure Table Sample\n');
  
  var counter = 0;
  
  basicAzureTableSamples.forEach(function(scenario) {
    console.log(scenario.message);
    
    scenario.action(function(error) {
      if(error) throw error;
      
      counter++;
      
      if(counter == basicAzureTableSamples.length) {
        advancedAzureTableSamples.forEach(function(scenario) {
          console.log(scenario.message);
    
          scenario.action(function(error) {
            if(error) throw error;
          })
        })
      }
    })
  })
}
