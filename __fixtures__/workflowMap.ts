import { jest } from '@jest/globals'

export const getWorkflowMapFromInput =
  jest.fn<typeof import('../src/workflowMap.js').getWorkflowMapFromInput>()
