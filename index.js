const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

async function run() {
  try {

    const content = fs.readFileSync(core.getInput('report_path'));
    jsonData = JSON.parse(content);

    const annotations = [];

    if (jsonData) {
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
        const response = await octokit.rest.checks.create({
          ...github.context.repo,
          name: 'Generate annotations',
          head_sha: github.context.sha,
          status: 'completed',
          conclusion: 'failure',
          output: {
            title: 'Check for flaky tests',
            summary: 'Found flaky tests.',
            annotations,
          },
        });
      }
      console.log(response);
    }
  } catch (error) {
  }
}

run();