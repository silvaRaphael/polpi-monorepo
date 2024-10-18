import React, { useEffect, useMemo, useState } from "react"
import {
  Link,
  LinkProps,
  NavigateFunction,
  useNavigate,
  useSearchParams
} from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import {
  Table as TableComponent,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TableCaption
} from "./table"
import { DateRange } from "../date-picker/types"
import { LoadingSpinner } from "../icons"
import { Pagination } from "./pagination"
import {
  GetFilterFromUrl,
  NumberRange,
  SelectedActionComponent,
  TableFilter,
  TableFilterKeys,
  tableFilters,
  TableHeaderData,
  TableRow as TableRowImported,
  TableData as TableDataImported,
  UseTableType,
  TableRowData,
  ActionComponent
} from "./data"
import { Filters } from "./filters"
import { Checkbox } from "../checkbox"
import { ScrollArea } from "../scroll-area"
import { useScrollPosition } from "@polpi/hooks"
import { queryClient, cn, PAGINATION_LIMIT } from "@polpi/lib"

export * from "./data"
export * from "./filters"
export * from "./pagination"
export * from "./use-table-pagination"

export type TableRow = TableRowImported
export type TableData = TableDataImported
export type UseTable = UseTableType

const TableComp = Object.assign(TableComponent, {
  Header: TableHeader,
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  Footer: TableFooter,
  Caption: TableCaption
})

export function useTableMutation<T>({
  tableKey,
  queryFn,
  doneFn
}: {
  tableKey: unknown[]
  queryFn: () => Promise<T>
  doneFn: (data: T) => void
}) {
  const { data, isLoading: loading } = useQuery({
    queryKey: tableKey,
    queryFn: async () => {
      setIsLoading(true)

      return await queryFn()
    }
  })

  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!data) return

    doneFn(data)

    setIsLoading(false)
  }, [data, JSON.stringify(tableKey), loading === isLoading])

  return {
    isLoading,
    updater: (oldData: (oldData: T) => unknown) =>
      queryClient.setQueryData(tableKey, (prev: T | undefined) =>
        prev ? oldData(prev) : null
      ),
    invalidate: () => queryClient.invalidateQueries({ queryKey: tableKey })
  }
}

export function getFilterFromUrlAsObject(filters: TableFilter[]) {
  return getFilterFromUrl(filters).reduce((acc, { id, type, keys, value }) => {
    acc[id] = {
      id,
      type,
      keys,
      value
    }
    return acc
  }, {} as Record<string, Omit<GetFilterFromUrl, "input">>)
}

export function getFilterFromUrl(filters: TableFilter[]) {
  const [searchParams] = useSearchParams()
  const params = new URLSearchParams(searchParams)

  const getFilterFromUrl = useMemo(
    () =>
      filters
        .map((filter) => {
          const [filterKey, filterLastKey] = Array.from(params.keys()).filter(
            (key) => key.includes(filter.id)
          )

          if (!filterKey) return null

          if (filterKey?.includes("[")) {
            let [filterId, key] = filterKey.split("[")
            key = key.replace("]", "")

            let lastKey: TableFilterKeys | undefined = undefined
            if (filterLastKey) {
              let [, key] = filterLastKey.split("[")
              lastKey = key.replace("]", "") as TableFilterKeys
            }

            const type = Object.entries(tableFilters).find((item) => {
              if (item[1].keys.length === 1)
                return item[1].keys.includes(key as never)
              if (item[1].keys.length === 2)
                return (
                  item[1].keys.includes(key as never) &&
                  item[1].keys.includes(lastKey as TableFilterKeys)
                )
            })?.[0]

            const selectedOption = filter.options.findIndex(
              (option) => option.type === type
            )

            const input = filter.options.find(
              (option) => option.type === type
            )?.input

            const urlValue = params.get(filterKey)
            const lastFilterKey = Array.from(params.keys())
              .filter((key) => key.includes(filterId))
              .reverse()[0]

            const urlLastValue =
              filterKey !== lastFilterKey ? params.get(lastFilterKey) : null

            let value = null

            switch (input) {
              case "text":
                value = urlValue
                break
              case "number":
                value = Number(urlValue)
                break
              case "number-range":
                value = value = {
                  from: Number(urlValue),
                  to: urlLastValue ? Number(urlLastValue) : null
                } as NumberRange
                break
              case "date":
                value = new Date(Number(urlValue))
                break
              case "date-range":
                value = {
                  from: new Date(Number(urlValue)),
                  to: urlLastValue ? new Date(Number(urlLastValue)) : null
                } as DateRange
                break
            }

            return {
              id: filterId,
              type,
              keys: [key, lastKey],
              input: filter.options[selectedOption].input,
              value
            } as GetFilterFromUrl
          }

          const urlValue = params.get(filterKey)

          const selectedOption = filter.options.findIndex(
            (option) => option.slug === urlValue
          )

          return {
            id: filterKey,
            type: "text",
            keys: [],
            input:
              filter.options[selectedOption >= 0 ? selectedOption : 0].input,
            value: urlValue
          } as GetFilterFromUrl
        })
        .filter((item) => !!item),
    [params]
  )

  return getFilterFromUrl
}

export function useTable({
  loading,
  isLoading,
  empty,
  actions: defaultActions = [],
  selectedActions: defaultSelectedActions,
  hasSelect,
  filters: defaultFilters = [],
  header,
  row,
  data: defaultData = [],
  pageSize = PAGINATION_LIMIT,
  totalCount: defaultTotalCount
}: TableData): UseTable {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const params = new URLSearchParams(searchParams)

  const [data, setData] = useState<TableRowData[]>(defaultData)
  const [totalCount, setTotalCount] = useState<number>(
    defaultTotalCount || defaultData?.length || 0
  )

  const [selectedRows, setSelectedRows] = useState<
    Record<number, TableRowData>
  >({})

  const [actions, setActions] = useState<ActionComponent[]>(defaultActions)
  const [selectedActions, setSelectedActions] = useState<
    SelectedActionComponent[]
  >(defaultSelectedActions ?? [])

  const [filterOpen, setFilterOpen] = useState<Record<string, boolean>>(
    defaultFilters.reduce((acc, crr) => {
      acc[crr.id] = false
      return acc
    }, {} as Record<string, boolean>)
  )

  const [filters, setFilters] = useState<TableFilter[]>(
    defaultFilters.map((filter) => ({
      ...filter,
      selectedOption: filter.selectedOption! ?? 0,
      valueModifier: filter.valueModifier
        ? filter.valueModifier
        : (value) => value
    }))
  )

  const getFilterFn = getFilterFromUrl(filters)

  const getFilters = Object.assign(getFilterFn, {
    asObject: getFilterFromUrlAsObject(filters),
    asKey: JSON.stringify(getFilterFn)
  })

  const filtersFromUrl = getFilters

  useEffect(() => {
    // Sync url params to state params
    setFilters((currentFilters) =>
      currentFilters.map((currentFilter) => {
        const filter = filtersFromUrl.find(
          (filter) => filter.id === currentFilter.id
        )

        if (filter) {
          return {
            ...currentFilter,
            type: filter.type,
            input: filter.input,
            selectedOption: currentFilter.options.findIndex((option) => {
              if (!option.input) {
                return option.slug == filter.value
              }

              return (
                option.type === filter.type && option.input === filter.input
              )
            }),
            value: filter.value
          }
        }

        return currentFilter
      })
    )
  }, [])

  function handleSubmitFilters(filter: TableFilter) {
    const selectedOption = filter.selectedOption || 0

    if (!!filter.options[selectedOption].input && filter.value == null) return

    let values = []

    switch (filter.options[selectedOption].input) {
      case "text":
        values = [filter.value ? String(filter.value) : undefined]
        break
      case "number":
        values = [filter.value ? String(filter.value) : undefined]
        break
      case "number-range":
        values = [
          (filter.value as NumberRange).from
            ? String((filter.value as NumberRange).from)
            : undefined,
          (filter.value as NumberRange).to
            ? String((filter.value as NumberRange).to)
            : undefined
        ]
        break
      case "date":
        values = [
          filter.value ? String((filter.value as Date).getTime()) : undefined
        ]
        break
      case "date-range":
        values = [
          (filter.value as DateRange).from
            ? String((filter.value as DateRange).from?.getTime())
            : undefined,
          (filter.value as DateRange).to
            ? String((filter.value as DateRange).to?.getTime())
            : undefined
        ]
        break
      default:
        values = [filter.options[selectedOption].slug]
        break
    }

    if (values.includes(undefined)) return

    const params = new URLSearchParams(searchParams)
    params.delete("page")

    Object.values(tableFilters).forEach((item) =>
      item.keys.forEach((key) => params.delete(`${filter.id}[${key}]`))
    )

    values.forEach((value, i) => {
      if (!filter.options[selectedOption].input) {
        params.set(filter.id, filter.options[selectedOption].slug!)
      } else
        params.set(
          `${filter.id}[${
            tableFilters[filter.options[selectedOption].type].keys[i]
          }]`,
          value!
        )
    })

    const queryString = params
      .toString()
      .replace(/%5B/g, "[")
      .replace(/%5D/g, "]")

    navigate(`?${queryString}`, { replace: true })

    setFilterOpen((prev) => ({
      ...prev,
      [filter.id]: false
    }))
  }

  return {
    loading,
    isLoading,
    empty,
    actions,
    setActions,
    selectedActions,
    setSelectedActions,
    hasSelect,
    selectedRows,
    setSelectedRows,
    filters,
    getFilters,
    header,
    row,
    data,
    setData: (data) => setData(data as TableRowData[]),
    page: params.get("page") ? Number(params.get("page")) : 0,
    pageSize,
    totalCount,
    setTotalCount,
    searchParams,
    navigate,
    params,
    setFilters,
    filterOpen,
    setFilterOpen,
    handleSubmitFilters
  }
}

export function Table(tableProps: {
  loading?: JSX.Element | null
  isLoading?: boolean
  empty?: JSX.Element | null
  actions?: ActionComponent[]
  selectedActions?: SelectedActionComponent[]
  hasSelect?: boolean
  selectedRows: Record<number, TableRowData>
  setSelectedRows: React.Dispatch<
    React.SetStateAction<Record<number, TableRowData>>
  >
  filters: TableFilter[]
  getFilters: GetFilterFromUrl[] & {
    asObject: Record<string, Omit<GetFilterFromUrl, "input">>
  }
  header: TableHeaderData[]
  row: TableRow
  data: TableRowData[]
  pageSize?: number
  page?: number
  totalCount?: number
  searchParams: URLSearchParams
  navigate: NavigateFunction
  params: URLSearchParams
  setFilters: React.Dispatch<React.SetStateAction<TableFilter[]>>
  filterOpen: Record<string, boolean>
  setFilterOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  handleSubmitFilters: (filter: TableFilter) => void
}) {
  const {
    loading,
    isLoading = false,
    empty,
    actions,
    selectedActions,
    hasSelect,
    selectedRows,
    setSelectedRows,
    filters,
    getFilters,
    header,
    row,
    data,
    pageSize,
    page,
    totalCount,
    searchParams,
    navigate,
    setFilters,
    filterOpen,
    setFilterOpen,
    handleSubmitFilters
  } = tableProps

  const filtersFromUrl = getFilters

  const { onScroll, scrollPosition, scrollPositionRef } =
    useScrollPosition("horizontal")

  return (
    <div>
      {isLoading &&
        (!!loading ? (
          loading
        ) : (
          <div className="py-40 flex justify-center">
            <LoadingSpinner />
          </div>
        ))}

      {!isLoading &&
        (!data || !data.length) &&
        !filtersFromUrl.length &&
        !page &&
        !!empty && <div className="py-14 border rounded-xl">{empty}</div>}

      {!isLoading &&
        !(
          (!data || !data.length) &&
          !filtersFromUrl.length &&
          !page &&
          !!empty
        ) && (
          <>
            {/* Table Topbar */}
            {(!!actions?.length || !!filters.length) && (
              <div className="flex justify-between items-center w-full space-x-4 pb-3 border-b">
                <Filters
                  {...{
                    filters,
                    searchParams,
                    navigate,
                    setFilters,
                    filterOpen,
                    setFilterOpen,
                    filtersFromUrl,
                    handleSubmitFilters
                  }}
                />

                {/* Actions */}
                <div className="flex items-center space-x-3">
                  {Object.keys(selectedRows).length > 0 && !!selectedActions ? (
                    <div className="flex items-center space-x-3">
                      <p className="text-sm text-gray-500">
                        {Object.keys(selectedRows).length} selecionado
                        {Object.keys(selectedRows).length > 1 ? "s" : ""}
                      </p>

                      <div className="h-8 w-px bg-gray-300" />

                      <span
                        className="w-min text-sm font-semibold hover:underline underline-offset-2 leading-4 text-gray-600 cursor-pointer"
                        onClick={() => setSelectedRows({})}
                      >
                        Cancelar seleção
                      </span>

                      {selectedActions?.map((item, i) => (
                        <React.Fragment key={i}>
                          {item(Object.values(selectedRows), setSelectedRows)}
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    actions?.map((item, i) => (
                      <React.Fragment key={i}>{item(data)}</React.Fragment>
                    ))
                  )}
                </div>
              </div>
            )}

            <ScrollArea aria-orientation="horizontal">
              <div className="flex-1 space-x-3">
                <div className="grid grid-cols-1 gap-5">
                  <TableComp
                    className="bg-white"
                    onScroll={onScroll}
                    ref={scrollPositionRef}
                  >
                    <TableComp.Header className="cursor-default">
                      <TableComp.Row className="hover:bg-white">
                        {hasSelect && (
                          <TableComp.Head
                            className={cn(
                              "h-full sticky left-0 bg-white w-8 block",
                              !["start", "none"].includes(
                                scrollPosition.position
                              ) && "bg-white group-hover/row:bg-gray-50",
                              !["start", "none"].includes(
                                scrollPosition.position
                              ) &&
                                "before:content-[''] before:absolute before:top-0 before:bottom-0 before:w-8 before:left-8 before:shadow-[inset_16px_0_24px_-16px_#dddddd]"
                            )}
                          >
                            <Checkbox
                              checked={
                                Object.keys(selectedRows).length > 0 &&
                                Object.keys(selectedRows).length ===
                                  data?.length
                              }
                              onCheckedChange={(checked) => {
                                setSelectedRows(() => {
                                  if (checked) {
                                    return Array.from({
                                      length: data?.length || 0
                                    })
                                      .map((_, i) => ({
                                        [i]: data[i]
                                      }))
                                      .reduce((acc, _, i) => {
                                        acc[i] = data[i] || {}
                                        return acc
                                      }, {})
                                  } else {
                                    return {}
                                  }
                                })
                              }}
                            />
                          </TableComp.Head>
                        )}

                        {header.map((head, i) => (
                          <TableComp.Head
                            key={i}
                            className={cn(
                              "text-[10px] text-gray-800 text-nowrap",
                              head.align === "start" && "text-start",
                              head.align === "center" && "text-center",
                              head.align === "end" && "text-end",
                              !head.content && "inline-block",
                              head.isButton &&
                                cn(
                                  "h-full sticky right-0 bg-white table-cell",
                                  !["end", "none"].includes(
                                    scrollPosition.position
                                  ) && "bg-white group-hover/row:bg-gray-50",
                                  !["end", "none"].includes(
                                    scrollPosition.position
                                  ) &&
                                    "before:content-[''] before:absolute before:top-0 before:bottom-0 before:w-8 before:right-[100%] before:shadow-[inset_-16px_0_24px_-16px_#dddddd]"
                                )
                            )}
                          >
                            {head.content}
                          </TableComp.Head>
                        ))}
                      </TableComp.Row>
                    </TableComp.Header>
                    <TableComp.Body className="cursor-default border-b">
                      {!data.length ? (
                        <TableComp.Row>
                          <TableComp.Cell
                            colSpan={header.length + (hasSelect ? 1 : 0)}
                            className="text-center px-4 py-8 text-gray-500 select-none"
                          >
                            Nenhum resultado encontrado.
                          </TableComp.Cell>
                        </TableComp.Row>
                      ) : (
                        data?.map((data, i) => {
                          const cols = Object.entries(row.content)

                          return (
                            <TableComp.Row
                              key={i}
                              className={cn("group/row", row.className)}
                            >
                              {hasSelect && (
                                <TableComp.Cell
                                  className={cn(
                                    "px-2 h-full sticky left-0 w-8 z-[1]",
                                    !["start", "none"].includes(
                                      scrollPosition.position
                                    ) && "bg-white group-hover/row:bg-gray-50",
                                    !["start", "none"].includes(
                                      scrollPosition.position
                                    ) &&
                                      "before:content-[''] before:absolute before:top-0 before:bottom-0 before:w-8 before:left-8 before:shadow-[inset_16px_0_24px_-16px_#dddddd]"
                                  )}
                                >
                                  <Checkbox
                                    checked={selectedRows?.[i]?.id === data.id}
                                    onCheckedChange={(checked) => {
                                      setSelectedRows((prev) => {
                                        if (checked) {
                                          return {
                                            ...prev,
                                            ...(data ? { [i]: data } : {})
                                          } as any
                                        } else {
                                          const { [i]: current, ...rest } = prev
                                          return {
                                            ...rest
                                          }
                                        }
                                      })
                                    }}
                                  />
                                </TableComp.Cell>
                              )}

                              {cols?.map(([key, content]) => {
                                if (content.hidden) return

                                const head = header.find(
                                  (header) => header.key === key
                                )

                                if (!head) return

                                const item = !!content.render
                                  ? content.render(data.content[key], data)
                                  : data.content[key]

                                return (
                                  <TableComp.Cell
                                    key={key}
                                    className={cn(
                                      "text-gray-600 text-nowrap relative",
                                      head.align === "start" && "text-start",
                                      head.align === "center" && "text-center",
                                      head.align === "end" && "text-end",
                                      !head.content &&
                                        !head.isButton &&
                                        "inline-block",
                                      head.isButton && "py-0.5",
                                      !React.isValidElement(item) &&
                                        "min-w-[110px]",
                                      head.className,
                                      head.isButton &&
                                        cn(
                                          "h-full sticky right-0",
                                          !["end", "none"].includes(
                                            scrollPosition.position
                                          ) &&
                                            "bg-white group-hover/row:bg-gray-50",
                                          !["end", "none"].includes(
                                            scrollPosition.position
                                          ) &&
                                            "before:content-[''] before:absolute before:top-0 before:bottom-0 before:w-8 before:right-[100%] before:shadow-[inset_-16px_0_24px_-16px_#dddddd]"
                                        )
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        head.isButton && "w-max",
                                        head.align === "start" && "me-auto",
                                        head.align === "center" && "mx-auto",
                                        head.align === "end" && "ms-auto"
                                      )}
                                    >
                                      {data.link &&
                                      data.link.href &&
                                      !head.isButton &&
                                      !content.hasLinkInside &&
                                      (!React.isValidElement(item) ||
                                        (!(item.props as LinkProps).to &&
                                          !(item.props as HTMLAnchorElement)
                                            .href)) ? (
                                        <Link
                                          to={data.link.href}
                                          target={data.link.target}
                                          className="block p-2 min-w-max"
                                        >
                                          {item}
                                        </Link>
                                      ) : (
                                        <div
                                          className={cn(
                                            "block min-w-max",
                                            head.isButton ? "px-2" : "p-2"
                                          )}
                                        >
                                          {item}
                                        </div>
                                      )}
                                    </div>
                                  </TableComp.Cell>
                                )
                              })}
                            </TableComp.Row>
                          )
                        })
                      )}
                    </TableComp.Body>
                  </TableComp>
                </div>
              </div>
            </ScrollArea>

            <Pagination
              pageSize={pageSize}
              results={data?.length || 0}
              totalCount={totalCount || data?.length || 0}
            />
          </>
        )}
    </div>
  )
}
