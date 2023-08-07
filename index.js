const core = require('@actions/core')
const github = require('@actions/github')
const json = require('./dusk_output.json')

if (json) {
  core.info('passed');
} else {

  core.setFailed('failed');

  const token = core.getInput('github_token')
  const octokit = new github.getOctokit(token)

  const check = await octokit.rest.checks.create({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    name: 'json',
    head_sha: github.context.sha,
    status: 'completed',
    conclusion: 'failure',
    output: {
      title: 'test title',
      summary: 'test summary',
      annotations: [
        {
          path: 'testpath',
          start_line: 1,
          end_line: 1,
          annotation_level: 'failure',
          message: 'testMessage',
          start_column: 1,
          end_column: 1
        }
      ]
    }
  });
}