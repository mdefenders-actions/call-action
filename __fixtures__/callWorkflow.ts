import { jest } from '@jest/globals'

export const callWorkflow =
  jest.fn<typeof import('../src/callWorkflow.js').callWorkflow>()
