import { NavigateFunction } from "react-router-dom"
import { ChevronDown, CornerDownRight, PlusCircle, XCircle } from "lucide-react"
import { ptBR } from "date-fns/locale"
import {
  GetFilterFromUrl,
  NumberRange,
  TableFilter,
  tableFilters
} from "./data"
import { DateRangePicker } from "../date-picker"
import { Popover } from "../popover"
import { Select } from "../select"
import { DateRange } from "../date-picker/types"
import { Label } from "../label"
import { Input } from "../input"
import { DatePicker } from "../date-picker/date-picker"
import { Button } from "../button"
import { formatDate } from "../date-picker/shared"

import { cn } from "@polpi/lib"

export function Filters(tableProps: {
  filters: TableFilter[]
  searchParams: URLSearchParams
  navigate: NavigateFunction
  setFilters: React.Dispatch<React.SetStateAction<TableFilter[]>>
  filterOpen: Record<string, boolean>
  setFilterOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  filtersFromUrl: GetFilterFromUrl[]
  handleSubmitFilters: (filter: TableFilter) => void
}) {
  const {
    filters,
    searchParams,
    navigate,
    setFilters,
    filterOpen,
    setFilterOpen,
    filtersFromUrl,
    handleSubmitFilters
  } = tableProps

  return (
    <div className="flex flex-wrap gap-0.5">
      {filters?.map((filter, i) => (
        <Popover
          key={i}
          openPopover={filterOpen[filter.id]}
          setOpenPopover={(open) => {
            setFilterOpen((prev) => ({
              ...prev,
              [filter.id]: open
            }))

            if (open && !filter.options[filter.selectedOption!].input) {
              setFilters((currentFilters) =>
                currentFilters.map((currentFilter) => {
                  if (currentFilter.id == filter.id) {
                    return {
                      ...currentFilter,
                      value: filter.options[filter.selectedOption!].slug
                    }
                  }

                  return currentFilter
                })
              )

              return
            }
            if (open) return

            // Reset unapplied filters
            const isEqual = filtersFromUrl.find((value) => {
              if (!value.value) return false

              const selectedOption = filter.selectedOption!

              if (!filter.options[selectedOption].input)
                return filter.value == (value.value as any)

              let exists = false

              switch (filter.options[selectedOption].input) {
                case "number":
                  exists = value.value == filter.value
                  break
                case "number-range":
                  exists =
                    (value.value as NumberRange).from ==
                      (filter.value as NumberRange)?.from &&
                    (value.value as NumberRange).to ==
                      (filter.value as NumberRange)?.to
                  break
                case "date":
                  exists =
                    new Date(value.value as Date).getTime() ==
                    new Date(filter.value as Date).getTime()
                  break
                case "date-range":
                  exists =
                    ((value.value as DateRange).from &&
                      (filter.value as DateRange)?.from &&
                      new Date((value.value as DateRange).from!).getTime() ==
                        new Date(
                          (filter.value as DateRange).from!
                        ).getTime()) ||
                    ((value.value as DateRange).to &&
                      (filter.value as DateRange)?.to &&
                      new Date((value.value as DateRange).to!).getTime() ==
                        new Date((filter.value as DateRange).to!).getTime()) ||
                    false
                  break
              }

              return exists
            })

            if (!isEqual) {
              if (!filter.options[filter.selectedOption!].input) {
                setFilters((currentFilters) =>
                  currentFilters.map((currentFilter) => {
                    const filter = filtersFromUrl.find(
                      (filter) => filter.id === currentFilter.id
                    )

                    const selectedOption = currentFilter.options.findIndex(
                      (option) => option.slug == filter?.value
                    )

                    return {
                      ...currentFilter,
                      selectedOption:
                        selectedOption >= 0
                          ? selectedOption
                          : currentFilter.selectedOption!,
                      value: filter ? filter.value : null
                    }
                  })
                )
              } else {
                setFilters((currentFilters) =>
                  currentFilters.map((currentFilter) => {
                    const filter = filtersFromUrl.find(
                      (filter) => filter.id === currentFilter.id
                    )

                    return {
                      ...currentFilter,
                      selectedOption:
                        currentFilter.lastSelectedOption ??
                        currentFilter.selectedOption!,
                      value: filter ? filter.value : null
                    }
                  })
                )
              }
            }
          }}
          align="start"
          content={
            <form
              onSubmit={(e) => {
                e.preventDefault()

                handleSubmitFilters(filter)
              }}
              className="z-50 min-w-[285px] overflow-hidden rounded-lg border bg-popover px-2.5 py-1.5 text-popover-foreground shadow-xl"
            >
              <div className="mb-2">
                <Label className="font-bold">
                  Filtrar por {filter.label.toLowerCase()}
                </Label>
              </div>

              {!!filter.options[filter.selectedOption!].input && (
                <>
                  {filter.options.length > 1 && (
                    <Select
                      value={filter.options[filter.selectedOption!].type}
                      onValueChange={(value) => {
                        setFilters((currentFilters) =>
                          currentFilters.map((currentFilter) => {
                            if (currentFilter.id === filter.id) {
                              return {
                                ...currentFilter,
                                value: null,
                                lastSelectedOption:
                                  currentFilter.selectedOption!,
                                selectedOption: filter.options.findIndex(
                                  (option) => option.type === value
                                )
                              }
                            }

                            return currentFilter
                          })
                        )
                      }}
                    >
                      <Select.Trigger className="font-semibold text-gray-700">
                        <Select.Value placeholder="Filtro" />
                      </Select.Trigger>
                      <Select.Content>
                        {filter.options.map((option, ii) => (
                          <Select.Item
                            key={ii}
                            value={option.type}
                            className="font-bold"
                          >
                            {tableFilters[option.type].input}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    {filter.options.length > 1 ? (
                      <CornerDownRight
                        strokeWidth={3}
                        className="size-3 text-color-500"
                      />
                    ) : (
                      <span className="text-nowrap text-sm">
                        {
                          tableFilters[
                            filter.options[filter.selectedOption!].type
                          ].input
                        }
                      </span>
                    )}

                    {filter.options[filter.selectedOption!].input ===
                      "number" && (
                      <Input
                        type="number"
                        placeholder="0"
                        value={(filter.value ?? "") as string}
                        onChange={(e) => {
                          setFilters((currentFilters) =>
                            currentFilters.map((currentFilter) => {
                              if (currentFilter.id === filter.id) {
                                return {
                                  ...currentFilter,
                                  value: e.target.value
                                }
                              }

                              return currentFilter
                            })
                          )
                        }}
                        wrapperClassName="w-full"
                      />
                    )}

                    {filter.options[filter.selectedOption!].input ===
                      "number-range" && (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="0"
                          value={(filter.value as NumberRange)?.from ?? ""}
                          onChange={(e) => {
                            setFilters((currentFilters) =>
                              currentFilters.map((currentFilter) => {
                                if (currentFilter.id === filter.id) {
                                  return {
                                    ...currentFilter,
                                    value: {
                                      ...(currentFilter.value as NumberRange),
                                      from: e.target.value
                                    } as any
                                  }
                                }

                                return currentFilter
                              })
                            )
                          }}
                          wrapperClassName="w-[130px]"
                        />
                        <span className="px-1">e</span>
                        <Input
                          type="number"
                          placeholder="0"
                          value={(filter.value as NumberRange)?.to ?? ""}
                          onChange={(e) => {
                            setFilters((currentFilters) =>
                              currentFilters.map((currentFilter) => {
                                if (currentFilter.id === filter.id) {
                                  return {
                                    ...currentFilter,
                                    value: {
                                      ...(currentFilter.value as NumberRange),
                                      to: e.target.value
                                    } as any
                                  }
                                }

                                return currentFilter
                              })
                            )
                          }}
                          onKeyDown={(e) => {
                            if (e.code === "Enter") handleSubmitFilters(filter)
                          }}
                          wrapperClassName="w-[130px]"
                        />
                      </div>
                    )}

                    {filter.options[filter.selectedOption!].input ===
                      "date" && (
                      <DatePicker
                        className="w-full"
                        value={(filter.value ?? undefined) as any}
                        onChange={(date) => {
                          if (!date) return

                          setFilters((currentFilters) =>
                            currentFilters.map((currentFilter) => {
                              if (currentFilter.id === filter.id) {
                                return {
                                  ...currentFilter,
                                  value: date
                                }
                              }

                              return currentFilter
                            })
                          )
                        }}
                      />
                    )}

                    {filter.options[filter.selectedOption!].input ===
                      "date-range" && (
                      <DateRangePicker
                        className="w-full"
                        value={(filter.value ?? undefined) as any}
                        onChange={(dateRange) => {
                          if (!dateRange?.from) return

                          setFilters((currentFilters) =>
                            currentFilters.map((currentFilter) => {
                              if (currentFilter.id === filter.id) {
                                return {
                                  ...currentFilter,
                                  value: dateRange
                                }
                              }

                              return currentFilter
                            })
                          )
                        }}
                      />
                    )}

                    {filter.options[filter.selectedOption!].input ===
                      "text" && (
                      <Input
                        type="text"
                        value={(filter.value ?? "") as string}
                        onChange={(e) => {
                          setFilters((currentFilters) =>
                            currentFilters.map((currentFilter) => {
                              if (currentFilter.id === filter.id) {
                                return {
                                  ...currentFilter,
                                  value: e.target.value
                                }
                              }

                              return currentFilter
                            })
                          )
                        }}
                        wrapperClassName="w-full"
                      />
                    )}
                  </div>
                </>
              )}

              {!filter.options[filter.selectedOption!].input && (
                <Select
                  value={
                    filter.options[filter.selectedOption!].slug ?? undefined
                  }
                  onValueChange={(value) => {
                    setFilters((currentFilters) =>
                      currentFilters.map((currentFilter) => {
                        if (currentFilter.id === filter.id) {
                          return {
                            ...currentFilter,
                            value,
                            lastSelectedOption: currentFilter.selectedOption!,
                            selectedOption: filter.options.findIndex(
                              (option) => option.slug === value
                            )
                          }
                        }

                        return currentFilter
                      })
                    )
                  }}
                >
                  <Select.Trigger className="font-semibold text-gray-700">
                    <Select.Value placeholder="Filtro" />
                  </Select.Trigger>
                  <Select.Content>
                    {filter.options.map((option, ii) => (
                      <Select.Item
                        key={ii}
                        value={option.slug!}
                        className="font-bold"
                      >
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              )}

              <Button
                variant="accent"
                text="Aplicar"
                className="mt-3"
                onClick={() => handleSubmitFilters(filter)}
              />
            </form>
          }
        >
          <Button
            key={i}
            variant="secondary"
            width="auto"
            text={filter.label}
            className={cn(
              "h-6 rounded-full font-semibold text-xs text-gray-500 border-dashed border-gray-300",
              !!filter.value && "border-solid"
            )}
            icon={
              !!filter.value ? (
                <XCircle
                  className="size-3 active:text-red-500"
                  onClick={(e) => {
                    e.preventDefault()

                    setFilters((currentFilters) =>
                      currentFilters.map((currentFilter) => {
                        if (currentFilter.id === filter.id) {
                          return {
                            ...currentFilter,
                            lastSelectedOption: null,
                            selectedOption: 0,
                            value: null
                          }
                        }

                        return currentFilter
                      })
                    )

                    const params = new URLSearchParams(searchParams)

                    filters.forEach(({ id }) => {
                      if (id === filter.id) {
                        Object.values(tableFilters).forEach((item) => {
                          if (!item.input) params.delete(filter.id)
                          item.keys.forEach((key) =>
                            params.delete(`${filter.id}[${key}]`)
                          )
                        })
                      }
                    })

                    const queryString = params
                      .toString()
                      .replace(/%5B/g, "[")
                      .replace(/%5D/g, "]")

                    navigate(`?${queryString}`, { replace: true })
                  }}
                />
              ) : (
                <PlusCircle className="size-3" />
              )
            }
            suffixIcon={
              !!filter.value ? (
                <div className="flex items-center ms-[3px]">
                  <div className="h-3 w-px bg-gray-300 me-1.5" />
                  <p className="text-color-600">
                    {tableFilters[filter.options[filter.selectedOption!].type]
                      .prefix &&
                      `${
                        tableFilters[
                          filter.options[filter.selectedOption!].type
                        ].prefix
                      } `}

                    {!filter.options[filter.selectedOption!].input &&
                      filter?.valueModifier?.(
                        filter.options[filter.selectedOption!].label
                      )}

                    {filter.options[filter.selectedOption!].input === "text" &&
                      filter?.valueModifier?.(filter.value)}
                    {filter.options[filter.selectedOption!].input ===
                      "number" && filter?.valueModifier?.(filter.value)}
                    {filter.options[filter.selectedOption!].input ===
                      "number-range" &&
                      `${
                        (filter.value as NumberRange).from !== null &&
                        (filter.value as NumberRange).from !== undefined
                          ? filter?.valueModifier?.(
                              (filter.value as NumberRange).from
                            )
                          : ""
                      } a ${
                        (filter.value as NumberRange)?.to !== null &&
                        (filter.value as NumberRange)?.to !== undefined
                          ? filter?.valueModifier?.(
                              (filter.value as NumberRange).to
                            )
                          : ""
                      }`}
                    {filter.options[filter.selectedOption!].input === "date" &&
                    filter.value
                      ? formatDate(new Date(filter.value as Date), ptBR)
                      : ""}
                    {filter.options[filter.selectedOption!].input ===
                      "date-range" &&
                      (filter.value as DateRange)?.from &&
                      `${formatDate(
                        new Date((filter.value as DateRange).from as Date),
                        ptBR
                      )} a ${
                        (filter.value as DateRange)?.to
                          ? formatDate(
                              new Date((filter.value as DateRange).to as Date),
                              ptBR
                            )
                          : ""
                      }`}
                  </p>
                  <ChevronDown
                    strokeWidth={3}
                    className="size-3 text-gray-500 ms-1"
                  />
                </div>
              ) : undefined
            }
          />
        </Popover>
      ))}

      {filters.find(
        (filter) => filter.value !== null && filter.value !== undefined
      ) && (
        <div
          className="text-color-600 hover:text-color-700 font-bold text-sm px-1.5 cursor-pointer"
          onClick={() => {
            setFilters((currentFilters) =>
              currentFilters.map((currentFilter) => ({
                ...currentFilter,
                lastSelectedOption: null,
                selectedOption: 0,
                value: null
              }))
            )

            const params = new URLSearchParams(searchParams)

            filters.forEach((filter) =>
              Object.values(tableFilters).forEach((item) => {
                if (!item.input) params.delete(filter.id)

                item.keys.forEach((key) =>
                  params.delete(`${filter.id}[${key}]`)
                )
              })
            )

            const queryString = params
              .toString()
              .replace(/%5B/g, "[")
              .replace(/%5D/g, "]")

            navigate(`?${queryString}`, { replace: true })
          }}
        >
          Limpar filtros
        </div>
      )}
    </div>
  )
}
