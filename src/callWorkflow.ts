import * as core from '@actions/core'
import * as github from '@actions/github'
import { WorkflowDefinition } from './workflowMap.js'

/**
 * Calls a workflow for the given repository and workflow definition.
 * @param repo The repository name.
 * @param value The workflow definition.
 */
export async function callWorkflow(
  repo: string,
  value: WorkflowDefinition
): Promise<void> {
  try {
    core.info(`Calling workflow for repo: ${repo}`)
    core.info(`Workflow YAML: ${value.yaml}`)
    core.info(`Workflow Data: ${JSON.stringify(value.data)}`)
    core.info(`Workflow Ref: ${value.ref}`)

    const githubToken =
      core.getInput('github-token') || process.env.GITHUB_TOKEN
    if (!githubToken) {
      throw new Error('GitHub token is required to call workflows.')
    }
    const [orgName, repoName] = repo.split('/')
    if (!orgName || !repoName) {
      throw new Error(
        `Invalid repository format: ${repo}. Expected format is 'owner/repo'.`
      )
    }
    const octokit = github.getOctokit(githubToken)
    await octokit.rest.actions.createWorkflowDispatch({
      owner: orgName,
      repo: repoName,
      workflow_id: value.yaml,
      ref: value.ref,
      inputs: value.data
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      core.error(`Failed to call workflow for ${repo}: ${error.message}`)
      throw error
    } else {
      core.error(`Failed to call workflow for ${repo} unknown error: ${error}`)
      throw new Error(
        `Unknown error ${error} occurred while calling workflow for ${repo}`
      )
    }
  }
}
