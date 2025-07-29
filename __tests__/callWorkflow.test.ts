import { jest } from '@jest/globals'

// Mocks
const infoMock = jest.fn()
const errorMock = jest.fn()
const getInputMock = jest.fn()
let octokitMock: unknown
let createWorkflowDispatchMock: jest.Mock

jest.unstable_mockModule('@actions/core', () => ({
  info: infoMock,
  error: errorMock,
  getInput: getInputMock
}))

jest.unstable_mockModule('@actions/github', () => ({
  getOctokit: jest.fn(() => octokitMock)
}))

const { callWorkflow } = await import('../src/callWorkflow.js')

const validWorkflow = {
  yaml: 'workflow.yaml',
  ref: 'main',
  data: { foo: 'bar' }
}

const repo = 'owner/repo'

beforeEach(() => {
  infoMock.mockClear()
  errorMock.mockClear()
  getInputMock.mockClear()
  createWorkflowDispatchMock = jest.fn(() => Promise.resolve())
  octokitMock = {
    rest: {
      actions: {
        createWorkflowDispatch: createWorkflowDispatchMock
      }
    }
  }
})

describe('callWorkflow', () => {
  it('calls workflow dispatch with correct parameters', async () => {
    getInputMock.mockReturnValue('token123')
    await callWorkflow(repo, validWorkflow)
    expect(infoMock).toHaveBeenCalledWith(`Calling workflow for repo: ${repo}`)
    expect(infoMock).toHaveBeenCalledWith(
      `Workflow YAML: ${validWorkflow.yaml}`
    )
    expect(infoMock).toHaveBeenCalledWith(
      `Workflow Data: ${JSON.stringify(validWorkflow.data)}`
    )
    expect(infoMock).toHaveBeenCalledWith(`Workflow Ref: ${validWorkflow.ref}`)
    expect(createWorkflowDispatchMock).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      workflow_id: 'workflow.yaml',
      ref: 'main',
      inputs: { foo: 'bar' }
    })
  })

  it('throws and logs error if github token is missing', async () => {
    getInputMock.mockReturnValue('')
    const origEnv = process.env.GITHUB_TOKEN
    process.env.GITHUB_TOKEN = ''
    await expect(callWorkflow(repo, validWorkflow)).rejects.toThrow(
      'GitHub token is required to call workflows.'
    )
    expect(errorMock).toHaveBeenCalledWith(
      expect.stringContaining('GitHub token is required to call workflows.')
    )
    process.env.GITHUB_TOKEN = origEnv
  })

  it('throws and logs error if repo format is invalid', async () => {
    getInputMock.mockReturnValue('token123')
    await expect(callWorkflow('invalidrepo', validWorkflow)).rejects.toThrow(
      /Invalid repository format/
    )
    expect(errorMock).toHaveBeenCalledWith(
      expect.stringContaining('Invalid repository format')
    )
  })

  it('throws and logs error if workflow dispatch fails', async () => {
    getInputMock.mockReturnValue('token123')
    createWorkflowDispatchMock.mockImplementationOnce(() => {
      throw new Error('dispatch failed')
    })
    await expect(callWorkflow(repo, validWorkflow)).rejects.toThrow(
      'dispatch failed'
    )
    expect(errorMock).toHaveBeenCalledWith(
      expect.stringContaining('dispatch failed')
    )
  })
  it('throws and logs unknown error', async () => {
    getInputMock.mockReturnValue('token123')
    createWorkflowDispatchMock.mockImplementationOnce(() => {
      throw 'unexpected string error'
    })
    await expect(callWorkflow(repo, validWorkflow)).rejects.toThrow(
      /Unknown error unexpected string error occurred while calling workflow for owner\/repo/
    )
    expect(errorMock).toHaveBeenCalledWith(
      expect.stringContaining('unknown error: unexpected string error')
    )
  })
})
