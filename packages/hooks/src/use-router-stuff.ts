import { useLocation, useNavigate, useSearchParams } from "react-router-dom"

export function useRouterStuff() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const searchParamsObj = Object.fromEntries(searchParams)

  const getQueryString = (
    kv?: Record<string, any>,
    opts?: {
      ignore?: string[]
    }
  ) => {
    const newParams = new URLSearchParams(searchParams)
    if (kv) {
      Object.entries(kv).forEach(([k, v]) => newParams.set(k, v))
    }
    if (opts?.ignore) {
      opts.ignore.forEach((k) => newParams.delete(k))
    }
    const queryString = newParams
      .toString()
      .replace(/%5B/g, "[")
      .replace(/%5D/g, "]")
    return queryString.length > 0 ? `?${queryString}` : ""
  }

  const queryParams = ({
    set,
    del,
    replace,
    getNewPath,
    arrayDelimiter = ","
  }: {
    set?: Record<string, string | string[]>
    del?: string | string[]
    replace?: boolean
    getNewPath?: boolean
    arrayDelimiter?: string
  }) => {
    const newParams = new URLSearchParams(searchParams)
    if (set) {
      Object.entries(set).forEach(([k, v]) =>
        newParams.set(k, Array.isArray(v) ? v.join(arrayDelimiter) : v)
      )
    }
    if (del) {
      if (Array.isArray(del)) {
        del.forEach((k) => newParams.delete(k))
      } else {
        newParams.delete(del)
      }
    }
    const queryString = newParams
      .toString()
      .replace(/%5B/g, "[")
      .replace(/%5D/g, "]")
    const newPath = `${pathname}${
      queryString.length > 0 ? `?${queryString}` : ""
    }`
    if (getNewPath) return newPath
    if (replace) {
      navigate(newPath, { replace: true })
    } else {
      navigate(newPath)
    }
  }

  return {
    pathname,
    navigate,
    searchParams,
    searchParamsObj,
    queryParams,
    getQueryString
  }
}
