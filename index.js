const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const jsonData = require(core.getInput('report_path'));

async function run() {
  try {
    const annotations = [];

    console.log(jsonData);

    if (doesFileExist(jsonData)) {
      // Loop through JSON items and check for the required property
      for (const item of jsonData) {
        annotations.push({
          title: item.title,
          message: item.message,
          path: item.file,
          start_line: item.line,
          end_line: item.line,
          annotation_level: item.annotation_level,
        });
      }

      if (annotations.length > 0) {
        const octokit = github.getOctokit(core.getInput('github_token'));
        await octokit.rest.checks.create({
          ...github.context.repo,
          name: 'Generate annotations',
          head_sha: github.context.sha,
          status: 'completed',
          conclusion: 'failure',
          output: {
            title: 'Check JSON Action',
            summary: 'The JSON check found issues.',
            annotations,
          },
        });
      } else {
        core.setFailed('File does not exist')
      }
    }
  } catch (error) {
  }
}

run();

function doesFileExist(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    core.setFailed('file does not exist');
    return false;
  }
}