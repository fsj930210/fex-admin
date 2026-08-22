import { Component, lazy, Suspense, type ReactElement, type ReactNode } from 'react'

type RouteComponent = () => ReactElement
type LazyModule<TExport extends string> = Record<TExport, RouteComponent>

interface RouteErrorBoundaryProps {
  children: ReactNode
}

interface RouteErrorBoundaryState {
  hasError: boolean
}

class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  state: RouteErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): RouteErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="p-6">
          <h1 className="text-xl font-semibold">页面加载失败</h1>
          <p className="mt-2 text-sm text-muted-foreground">请刷新页面后重试。</p>
        </main>
      )
    }

    return this.props.children
  }
}

function RouteLoadingFallback() {
  return (
    <main className="p-6">
      <p className="text-sm text-muted-foreground">页面加载中...</p>
    </main>
  )
}

export function createLazyRouteElement<TExport extends string>(
  loader: () => Promise<LazyModule<TExport>>,
  exportName: TExport,
) {
  const LazyComponent = lazy(() =>
    loader().then((module) => {
      const Page: RouteComponent = module[exportName]

      return {
        default: function LazyRoutePage() {
          return <Page />
        },
      }
    }),
  )

  return (
    <RouteErrorBoundary>
      <Suspense fallback={<RouteLoadingFallback />}>
        <LazyComponent />
      </Suspense>
    </RouteErrorBoundary>
  )
}
