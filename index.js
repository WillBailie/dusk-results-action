const core = require('@actions/core');
const data = require('./dusk_output.json');

try {
  data.forEach(element => {
    console.log(element.name);
  });

} catch (error) {
  core.setFailed(error.message);
}