const core = require('@actions/core');
const github = require('@actions/github');
// const jsonData = require(core.getInput('report_path'));
const fs = require('fs');
const path = require('path');

// Resolve relative path based on the workflow's working directory
const relativePath = core.getInput('report_path');
const absolutePath = path.resolve(process.cwd(), relativePath);

const data = fs.readFileSync(absolutePath);

console.log(JSON.parse(data));

async function run() {
  try {

    const annotations = [];

    console.log('test')

    if (jsonData) {
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
      }
    }
  } catch (error) {
  }
}

run();