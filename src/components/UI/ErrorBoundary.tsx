import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  readonly fallback: ReactNode
  readonly onError?: (error: Error) => void
  readonly children: ReactNode
}

interface State {
  readonly failed: boolean
}

/** Catches render errors (e.g. WebGL context or asset failures) and shows a fallback. */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[stage] 3D experience failed to render', error, info.componentStack)
    this.props.onError?.(error)
  }

  override render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
