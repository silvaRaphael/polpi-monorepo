import { DateRange } from "../date-picker/types"
import { ReactNode } from "react"
import { NavigateFunction } from "react-router-dom"

export type TableHeaderData = {
  key: string
  content?: string | JSX.Element | null
  align?: "start" | "center" | "end"
  isButton?: boolean
  className?: string
}

export type TableRow = {
  className?: string
  content: Record<
    string,
    {
      render?: (
        value: any,
        rowData?: TableRowData
      ) => string | number | JSX.Element | null
      hidden?: boolean
      hasLinkInside?: boolean
    }
  >
}

export type TableRowData = {
  id: string | number
  link?: {
    href: string
    target?: React.HTMLAttributeAnchorTarget
  } | null
  content: Record<string, any>
}

export type TableFilterKeys = "lk" | "eq" | "gt" | "lt" | "gte" | "lte"

export type TableFilterTypeProps = {
  keys: TableFilterKeys[]
  input: string | null
  prefix: string | null
}

export const tableFilters: Record<
  | "text"
  | "like"
  | "equals"
  | "between"
  | "greaterThan"
  | "lowerThan"
  | "greaterThanEquals"
  | "lowerThanEquals",
  TableFilterTypeProps
> = {
  text: {
    keys: [],
    input: null,
    prefix: null
  },
  like: {
    keys: ["lk"],
    input: "está em",
    prefix: null
  },
  equals: {
    keys: ["eq"],
    input: "é igual a",
    prefix: null
  },
  between: {
    keys: ["gte", "lte"],
    input: "está entre",
    prefix: null
  },
  greaterThan: {
    keys: ["gt"],
    input: "é maior que",
    prefix: "A partir de"
  },
  lowerThan: {
    keys: ["lt"],
    input: "é menor que",
    prefix: "Até"
  },
  greaterThanEquals: {
    keys: ["gte"],
    input: "é maior ou igual que",
    prefix: "A partir de"
  },
  lowerThanEquals: {
    keys: ["lte"],
    input: "é menor ou igual que",
    prefix: "Até"
  }
} as const

export const filtersKeys = [
  "text",
  "equals",
  "between",
  "greaterThan",
  "lowerThan",
  "greaterThanEquals",
  "lowerThanEquals"
] as const

export type TableFilters = keyof typeof tableFilters

export type TableFiltersInput =
  | "number"
  | "number-range"
  | "date"
  | "date-range"
  | "text"

export type GetFilterFromUrl = {
  id: string
  type: TableFilters
  keys: TableFilterKeys[]
  input: TableFiltersInput
  value: string | number | NumberRange | Date | DateRange | null
}

export type NumberRange = {
  from: number
  to?: number
}

export type TableFilter = {
  id: string
  label: string
  lastSelectedOption?: number | null
  selectedOption?: number
  value?: Date | DateRange | number | NumberRange | boolean | string | null
  valueModifier?: (value: any) => any
  options: {
    type: TableFilters
    input?: TableFiltersInput | null
    slug?: string | null
    label?: string | null
  }[]
}

export type SelectedActionComponent = (
  selectedRows: TableRowData[],
  setSelectedRows: React.Dispatch<
    React.SetStateAction<Record<number, TableRowData>>
  >
) => ReactNode

export type ActionComponent = (rows: TableRowData[]) => JSX.Element

export type TableData = {
  loading?: JSX.Element | null
  isLoading?: boolean
  empty?: JSX.Element | null
  actions?: ActionComponent[]
  selectedActions?: SelectedActionComponent[]
  hasSelect?: boolean
  filters?: TableFilter[]
  header: TableHeaderData[]
  row: TableRow
  data?: TableRowData[]
  pageSize?: number
  totalCount?: number
}

export type UseTableType = {
  loading: JSX.Element | null | undefined
  isLoading: boolean | undefined
  empty: JSX.Element | null | undefined
  actions?: ActionComponent[]
  setActions: React.Dispatch<React.SetStateAction<ActionComponent[]>>
  selectedActions?: SelectedActionComponent[]
  setSelectedActions: React.Dispatch<
    React.SetStateAction<SelectedActionComponent[]>
  >
  hasSelect?: boolean
  selectedRows: Record<number, TableRowData>
  setSelectedRows: React.Dispatch<
    React.SetStateAction<Record<number, TableRowData>>
  >
  filters: TableFilter[]
  getFilters: GetFilterFromUrl[] & {
    asObject: Record<string, Omit<GetFilterFromUrl, "input">>
    asKey: string
  }
  header: TableHeaderData[]
  row: TableRow
  data: TableRowData[]
  setData: React.Dispatch<React.SetStateAction<TableRowData[]>>
  page: number
  pageSize: number
  totalCount: number
  setTotalCount: React.Dispatch<React.SetStateAction<number>>
  searchParams: URLSearchParams
  navigate: NavigateFunction
  params: URLSearchParams
  setFilters: React.Dispatch<React.SetStateAction<TableFilter[]>>
  filterOpen: Record<string, boolean>
  setFilterOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  handleSubmitFilters: (filter: TableFilter) => void
}
