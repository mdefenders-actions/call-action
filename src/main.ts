import * as core from '@actions/core'
import { getWorkflowMapFromInput } from './workflowMap.js'
import { callWorkflow } from './callWorkflow.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */

export async function run(): Promise<void> {
  try {
    core.startGroup('Iterating over workflows to call')
    const workflowMap = await getWorkflowMapFromInput()

    for (const [repo, value] of Object.entries(workflowMap)) {
      await callWorkflow(repo, value)
      const summaryReport = `- called workflow ${value.yaml} for ${repo} with ${JSON.stringify(value.data)}`
      await core.summary.addRaw(summaryReport, true).write()
    }
    core.endGroup()
  } catch (error: unknown) {
    if (error instanceof Error) {
      core.error(`Action failed with error: ${error.message}`)
      core.setFailed(error.message)
    } else {
      core.error('Action failed with an unknown error')
      core.setFailed('Unknown error occurred')
    }
  }
}
