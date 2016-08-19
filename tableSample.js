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

var basicScenarios = require('./basic.js');
var advancedScenarios = require('./advanced.js');

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

function runAzureTableSamples() {
  /**
   * Instructions: This sample can be run using either the Azure Storage Emulator that installs as part of the Microsoft Azure SDK, which is available in Windows only - or by  
   * updating the app.config file with your connection string.
   *
   * To run the sample using the Storage Emulator (Microsoft Azure SDK)
   *      Start the Azure Storage Emulator (once only) by pressing the Start button or the Windows key and searching for it
   *      by typing "Azure Storage Emulator". Select it from the list of applications to start it.
   * 
   * To run the sample using the Storage Service
   *      Open the app.config file and comment out the connection string for the emulator ("useDevelopmentStorage":true) and
   *      set the connection string for the storage service.
   *
   */
  console.log('\nAzure Table Samples\n');

  var scenarios = basicScenarios.concat(advancedScenarios);

  var current = 0;

  var callback = function (error) {
    if (error) {
      throw error;
    } else {
      if (current < scenarios.length)
        console.log(scenarios[current].message);

      current++;
      if (current < scenarios.length) {
        scenarios[current].action(callback);
      }
    }
  };

  scenarios[current].action(callback);
}
