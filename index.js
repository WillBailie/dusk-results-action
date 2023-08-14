const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

if (core.getInput('report_path') == './dusk_output.json') {
  console.log('true');
} else {
  console.log('false');
}
const content = fs.readFileSync(core.getInput('report_path'));
console.log(content);
const jsonData = JSON.parse(content);

async function run() {
  try {

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
      }
    }
  } catch (error) {
  }
}

run();