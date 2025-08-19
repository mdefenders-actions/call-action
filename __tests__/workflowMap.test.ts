import { jest } from '@jest/globals'

// Mock @actions/core
const errorMock = jest.fn()
let inputMock: jest.Mock
jest.unstable_mockModule('@actions/core', () => ({
  getInput: (...args: unknown[]) => inputMock(...args),
  error: errorMock
}))

const { getWorkflowMapFromInput } = await import('../src/workflowMap.js')

describe('getWorkflowMapFromInput', () => {
  beforeEach(() => {
    errorMock.mockClear()
    inputMock = jest.fn()
  })

  it('returns valid workflow map for correct input', async () => {
    inputMock.mockReturnValue(
      JSON.stringify({
        'repo/test': {
          yaml: 'file.yaml',
          data: { foo: 'bar' },
          ref: 'main'
        }
      })
    )
    const result = await getWorkflowMapFromInput()
    expect(result).toEqual({
      'repo/test': {
        yaml: 'file.yaml',
        data: { foo: 'bar' },
        ref: 'main'
      }
    })
  })

  it('throws error for invalid JSON', async () => {
    inputMock.mockReturnValue('{invalid json}')
    await expect(getWorkflowMapFromInput()).rejects.toThrow(
      'Failed to parse input as JSON.'
    )
    expect(errorMock).toHaveBeenCalled()
  })

  it('throws error for missing input', async () => {
    inputMock.mockReturnValue(null)
    await expect(getWorkflowMapFromInput()).rejects.toThrow('No input provided')
  })

  it('throws error for missing yaml field', async () => {
    inputMock.mockReturnValue(
      JSON.stringify({
        'repo/test': {
          data: {},
          ref: 'main'
        }
      })
    )
    await expect(getWorkflowMapFromInput()).rejects.toThrow(
      /missing a valid 'yaml' field/
    )
    expect(errorMock).toHaveBeenCalled()
  })

  it('throws error for missing data field', async () => {
    inputMock.mockReturnValue(
      JSON.stringify({
        'repo/test': {
          yaml: 'file.yaml',
          ref: 'main'
        }
      })
    )
    await expect(getWorkflowMapFromInput()).rejects.toThrow(
      /missing a valid 'data' field/
    )
    expect(errorMock).toHaveBeenCalled()
  })

  it('throws error for missing ref field', async () => {
    inputMock.mockReturnValue(
      JSON.stringify({
        'repo/test': {
          yaml: 'file.yaml',
          data: {}
        }
      })
    )
    await expect(getWorkflowMapFromInput()).rejects.toThrow(
      /missing a valid 'ref' field/
    )
    expect(errorMock).toHaveBeenCalled()
  })

  it('throws error for wrong type in yaml', async () => {
    inputMock.mockReturnValue(
      JSON.stringify({
        'repo/test': {
          yaml: 123,
          data: {},
          ref: 'main'
        }
      })
    )
    await expect(getWorkflowMapFromInput()).rejects.toThrow(
      /missing a valid 'yaml' field/
    )
    expect(errorMock).toHaveBeenCalled()
  })

  it('throws error for wrong type in data', async () => {
    inputMock.mockReturnValue(
      JSON.stringify({
        'repo/test': {
          yaml: 'file.yaml',
          data: 'not-an-object',
          ref: 'main'
        }
      })
    )
    await expect(getWorkflowMapFromInput()).rejects.toThrow(
      /missing a valid 'data' field/
    )
    expect(errorMock).toHaveBeenCalled()
  })

  it('throws error for array in data', async () => {
    inputMock.mockReturnValue(
      JSON.stringify({
        'repo/test': {
          yaml: 'file.yaml',
          data: [],
          ref: 'main'
        }
      })
    )
    await expect(getWorkflowMapFromInput()).rejects.toThrow(
      /missing a valid 'data' field/
    )
    expect(errorMock).toHaveBeenCalled()
  })

  it('throws error for wrong type in ref', async () => {
    inputMock.mockReturnValue(
      JSON.stringify({
        'repo/test': {
          yaml: 'file.yaml',
          data: {},
          ref: 123
        }
      })
    )
    await expect(getWorkflowMapFromInput()).rejects.toThrow(
      /missing a valid 'ref' field/
    )
    expect(errorMock).toHaveBeenCalled()
  })

  it('throws error for empty string in yaml', async () => {
    inputMock.mockReturnValue(
      JSON.stringify({
        'repo/test': {
          yaml: '',
          data: {},
          ref: 'main'
        }
      })
    )
    await expect(getWorkflowMapFromInput()).rejects.toThrow(
      /missing a valid 'yaml' field/
    )
    expect(errorMock).toHaveBeenCalled()
  })

  it('throws error for empty string in ref', async () => {
    inputMock.mockReturnValue(
      JSON.stringify({
        'repo/test': {
          yaml: 'file.yaml',
          data: {},
          ref: ''
        }
      })
    )
    await expect(getWorkflowMapFromInput()).rejects.toThrow(
      /missing a valid 'ref' field/
    )
    expect(errorMock).toHaveBeenCalled()
  })

  it('throws error for workflow definition that is null', async () => {
    inputMock.mockReturnValue(
      JSON.stringify({
        'repo/test': null
      })
    )
    await expect(getWorkflowMapFromInput()).rejects.toThrow(
      "Workflow definition for 'repo/test' must be an object."
    )
    expect(errorMock).toHaveBeenCalled()
  })

  it('throws error for workflow definition that is not an object', async () => {
    inputMock.mockReturnValue(
      JSON.stringify({
        'repo/test': 'not-an-object'
      })
    )
    await expect(getWorkflowMapFromInput()).rejects.toThrow(
      "Workflow definition for 'repo/test' must be an object."
    )
    expect(errorMock).toHaveBeenCalled()
  })
})
