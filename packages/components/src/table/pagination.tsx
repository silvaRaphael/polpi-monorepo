import { Button } from "../button"
import { usePagination } from "./use-table-pagination"

export function Pagination({
  pageSize,
  results,
  totalCount
}: {
  pageSize?: number
  results: number
  totalCount: number
}) {
  const { pagination, setPagination } = usePagination(pageSize)

  return (
    <div className="flex justify-between items-center w-full py-1.5">
      <p className="text-sm text-gray-600">
        {results} resultado{results > 1 && "s"} de {totalCount}
      </p>

      <div className="flex gap-1.5">
        <Button
          variant="shadow"
          width="auto"
          className="h-7 text-xs text-gray-600"
          text="Voltar"
          onClick={() =>
            setPagination({
              pageIndex: pagination.pageIndex - 1,
              pageSize: pagination.pageSize
            })
          }
          disabled={pagination.pageIndex === 0}
        />
        <Button
          variant="shadow"
          width="auto"
          className="h-7 text-xs text-gray-600"
          text="Avançar"
          onClick={() =>
            setPagination({
              pageIndex: pagination.pageIndex + 1,
              pageSize: pagination.pageSize
            })
          }
          disabled={
            pagination.pageIndex * pagination.pageSize + pagination.pageSize >=
              totalCount || results < (pageSize || 0)
          }
        />
      </div>
    </div>
  )
}
