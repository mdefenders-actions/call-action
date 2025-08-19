export function getInput(key: string): string {
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
  if (key === 'workflows-to-call') return mockWorkflowMap

  return ''
}
