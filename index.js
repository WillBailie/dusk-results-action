const core = require('@actions/core');
const github = require('@actions/github');
const jsonData = require('./dusk_output.json');

async function run() {
  try {
    const annotations = [];
    
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
      if (octokit && typeof octokit.checks === 'object' && typeof octokit.checks.create === 'function') {
        console.log('octokit instantiated');
      } else {
        console.log('octokit not instantiated');
      }
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
      core.setFailed('JSON check failed.');
    }
     else {
      console.log('JSON check passed.');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();