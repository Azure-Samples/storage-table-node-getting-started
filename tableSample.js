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

runAzureTableSamples();

function runAzureTableSamples() {
  console.log('\nAzure Cosmos DB Table API and Azure Table storage samples\n');

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
