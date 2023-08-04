const core = require('@actions/core');
const github = require('@actions/github');
const data = require('./dusk_output.json');
const { Octokit } = require("@octokit/rest");

try {
      var testA = JSON.parse(JSON.stringify(data));
      // testA.forEach(element => {
        // console.log(element.name);
      // });
      core.error(element.name)
      
  } catch (error) {
    core.setFailed(error.message);
  }