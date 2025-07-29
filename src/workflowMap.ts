import * as core from '@actions/core'

export interface WorkflowDefinition {
  yaml: string
  data: Record<string, unknown>
  ref: string
}

export interface WorkflowMap {
  [repo: string]: WorkflowDefinition
}

/**
 * Parses and validates the workflow map input from GitHub Actions.
 * Ensures each workflow entry contains required fields and correct types.
 * @returns {WorkflowMap} The validated workflow map.
 * @throws {Error} If input is missing or invalid.
 */
export async function getWorkflowMapFromInput(): Promise<WorkflowMap> {
  const inputStr = core.getInput('workflows-to-call', { required: true })
  let input: WorkflowMap
  try {
    input = JSON.parse(inputStr)
  } catch (error) {
    core.error(`Failed to parse input as JSON: ${error}`)
    throw new Error('Failed to parse input as JSON.')
  }
  if (!input) {
    throw new Error('No input provided')
  }

  // Validate each workflow entry
  for (const [repo, def] of Object.entries(input)) {
    if (typeof def !== 'object' || def === null) {
      core.error(`Workflow definition for '${repo}' must be an object.`)
      throw new Error(`Workflow definition for '${repo}' must be an object.`)
    }
    if (typeof def.yaml !== 'string' || def.yaml.trim() === '') {
      core.error(
        `Workflow definition for '${repo}' is missing a valid 'yaml' field.`
      )
      throw new Error(
        `Workflow definition for '${repo}' is missing a valid 'yaml' field.`
      )
    }
    if (
      typeof def.data !== 'object' ||
      def.data === null ||
      Array.isArray(def.data)
    ) {
      core.error(
        `Workflow definition for '${repo}' is missing a valid 'data' field.`
      )
      throw new Error(
        `Workflow definition for '${repo}' is missing a valid 'data' field.`
      )
    }
    if (typeof def.ref !== 'string' || def.ref.trim() === '') {
      core.error(
        `Workflow definition for '${repo}' is missing a valid 'ref' field.`
      )
      throw new Error(
        `Workflow definition for '${repo}' is missing a valid 'ref' field.`
      )
    }
  }

  return input
}
