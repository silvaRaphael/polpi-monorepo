import { useEffect, useMemo, useState } from "react"
import { PaginationState } from "@tanstack/react-table"
import { useRouterStuff } from "@comps/hooks"
import { PAGINATION_LIMIT } from "@comps/lib"

export function useTablePagination(props?: {
  pageSize?: number
  page?: number
  onPageChange?: (page: number) => void
}) {
  const pageSize = props?.pageSize || PAGINATION_LIMIT
  const onPageChange = props?.onPageChange
  const defaultPage = props?.page

  const { searchParams, queryParams } = useRouterStuff()

  const page = useMemo(
    () => defaultPage || parseInt(searchParams.get("page") || "0") || 0,
    [defaultPage, searchParams.get("page")]
  )

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page,
    pageSize
  })

  useEffect(() => {
    setPagination((p) => ({
      ...p,
      pageIndex: page
    }))
  }, [page])

  useEffect(() => {
    const p = pagination.pageIndex

    if (!onPageChange)
      queryParams(
        p === 0
          ? { del: "page" }
          : {
              set: {
                page: p.toString()
              }
            }
      )

    onPageChange?.(pagination.pageIndex)
  }, [pagination])

  return { pagination, setPagination }
}

export function usePagination(pageSize = PAGINATION_LIMIT) {
  const { searchParams, queryParams } = useRouterStuff()

  const page = useMemo(
    () => parseInt(searchParams.get("page") || "0") || 0,
    [searchParams.get("page")]
  )

  const { pagination, setPagination } = useTablePagination({
    pageSize,
    page,
    onPageChange: (p) => {
      queryParams(
        p === 0
          ? { del: "page" }
          : {
              set: {
                page: p.toString()
              }
            }
      )
    }
  })

  // Update state when URL parameter changes
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "0") || 0
    setPagination((p) => ({
      ...p,
      pageIndex: page
    }))
  }, [searchParams.get("page")])

  // Update URL parameter when state changes
  useEffect(() => {
    queryParams(
      pagination.pageIndex === 0
        ? { del: "page" }
        : {
            set: {
              page: pagination.pageIndex.toString()
            }
          }
    )
  }, [pagination])

  return { pagination, setPagination }
}

export function useTableCursor(props?: {
  pageSize?: number
  cursor?: number | null
  onCursorChange?: (cursor: number | null) => void
}) {
  const pageSize = props?.pageSize || PAGINATION_LIMIT
  const onCursorChange = props?.onCursorChange
  const defaultCursor = props?.cursor

  const { searchParams, queryParams } = useRouterStuff()

  const cursor = useMemo(
    () => defaultCursor || parseInt(searchParams.get("cursor") || "0") || 0,
    [defaultCursor, searchParams.get("cursor")]
  )

  const [pagination, setPagination] = useState<{
    cursor: number | null
    pageSize: number
  }>({
    cursor,
    pageSize
  })

  useEffect(() => {
    setPagination((p) => ({
      ...p,
      cursor
    }))
  }, [cursor])

  useEffect(() => {
    const p = pagination.cursor

    if (!onCursorChange)
      queryParams(
        !p || p === 0
          ? { del: "cursor" }
          : {
              set: {
                cursor: p.toString()
              }
            }
      )

    onCursorChange?.(pagination.cursor)
  }, [pagination])

  return { pagination, setPagination }
}

export function useCursor(pageSize = PAGINATION_LIMIT) {
  const { searchParams, queryParams } = useRouterStuff()

  const cursor = useMemo(
    () => parseInt(searchParams.get("cursor") ?? "") || null || null,
    [searchParams.get("cursor")]
  )

  const { pagination, setPagination } = useTableCursor({
    pageSize,
    cursor,
    onCursorChange: (p) => {
      queryParams(
        !p || p === 0
          ? { del: "cursor" }
          : {
              set: {
                cursor: p.toString()
              }
            }
      )
    }
  })

  // Update state when URL parameter changes
  useEffect(() => {
    const cursor = parseInt(searchParams.get("cursor") ?? "") || null || null
    setPagination((p) => ({
      ...p,
      cursor
    }))
  }, [searchParams.get("cursor")])

  // Update URL parameter when state changes
  useEffect(() => {
    queryParams(
      !pagination.cursor || pagination.cursor === 0
        ? { del: "cursor" }
        : {
            set: {
              cursor: pagination.cursor.toString()
            }
          }
    )
  }, [pagination])

  return { pagination, setPagination }
}
