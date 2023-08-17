const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

async function run() {
  try {

    const content = fs.readFileSync(core.getInput('report_path'));
    jsonData = JSON.parse(content);

    const annotations = [];

    if (jsonData) {
      console.log(jsonData);
      for (const item of jsonData) {
        annotations.push({
          title: item.title,
          message: item.message ,
          path: item.file,
          start_line: item.line,
          end_line: item.line,
          annotation_level: item.annotation_level,
        });
      }

      if (annotations.length > 0) {
        const octokit = github.getOctokit(core.getInput('github_token'));

        try {     
          annotations.forEach(element => {
            core.warning(element.title + " is marked as flaky, consider rerunning");
          });
        } catch (error) {
          console.error('API Error:', error.message);
          core.setFailed('Failed to create annotations.');
        }
      } else {
        console.log('No annotations to create.');
      }
    } else {
      console.log(jsonData);
      core.setFailed('No json content available');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();