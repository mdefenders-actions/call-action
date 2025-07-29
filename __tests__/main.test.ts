import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import { getWorkflowMapFromInput } from '../__fixtures__/workflowMap.js'
import { callWorkflow } from '../__fixtures__/callWorkflow.js'
import { getInput } from '../__tests__/getInput.js'

// Mock dependencies
const mockWorkflowMap = {
  'mdefenders/it-delivers-everywhere-gitops': {
    yaml: 'cd-update-gitops.yaml',
    ref: 'main',
    data: {
      'gitops-branch': 'main',
      'new-tag': '0.0.1',
      'gitops-file': 'manifest.yaml',
      environment: 'production',
      image: 'ghcr.io/mdefenders/app:0.0.1',
      app: 'my-app',
      replicas: '3',
      rollback: 'false',
      'dry-run': 'false'
    }
  }
}

jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/workflowMap.js', () => ({
  getWorkflowMapFromInput
}))
jest.unstable_mockModule('../src/callWorkflow.js', () => ({ callWorkflow }))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    core.getInput.mockImplementation((key) => {
      return getInput(key)
    })
    getWorkflowMapFromInput.mockResolvedValue(mockWorkflowMap)
  })

  it('calls workflows for each entry', async () => {
    await run()
    expect(getWorkflowMapFromInput).toHaveBeenCalled()
    expect(callWorkflow).toHaveBeenCalledWith(
      'mdefenders/it-delivers-everywhere-gitops',
      mockWorkflowMap['mdefenders/it-delivers-everywhere-gitops']
    )
  })

  it('marks action as failed if callWorkflow throws', async () => {
    ;(callWorkflow as jest.Mock).mockImplementationOnce(() => {
      throw new Error('workflow error')
    })
    await run()
    expect(core.setFailed).toHaveBeenCalledWith('workflow error')
  })
  it('marks action as failed if callWorkflow throws unknown error', async () => {
    ;(callWorkflow as jest.Mock).mockImplementationOnce(() => {
      throw 'workflow error'
    })
    await run()
    expect(core.setFailed).toHaveBeenCalledWith('Unknown error occurred')
  })
})
