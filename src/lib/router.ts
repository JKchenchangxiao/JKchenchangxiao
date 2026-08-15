import { useEffect, useState } from 'react'

export type Route = 'dashboard' | 'flashcards' | 'quiz' | 'reading' | 'phrases' | 'glossary'

const routes: Route[] = ['dashboard', 'flashcards', 'quiz', 'reading', 'phrases', 'glossary']

const parse = (): Route => {
  const hash = window.location.hash.replace(/^#\/?/, '') as Route
  return routes.includes(hash) ? hash : 'dashboard'
}

/** 极简 hash 路由：站点只有六个页面，不值得引入路由库 */
export function useRoute(): [Route, (r: Route) => void] {
  const [route, setRoute] = useState<Route>(parse)

  useEffect(() => {
    const onChange = () => setRoute(parse())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = (r: Route) => {
    window.location.hash = `/${r}`
    window.scrollTo({ top: 0 })
  }

  return [route, navigate]
}
