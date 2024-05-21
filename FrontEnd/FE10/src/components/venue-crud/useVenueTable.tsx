import { useQuery } from '@tanstack/react-query'
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { API_GET_ALL_USER_QUERY_KEYS } from 'src/hooks/get-all-user.constants'
import { IQueryPagination, IQuerySearch, IResponse } from '../../types'
import { IVenue } from 'src/types/venue'
import { GetVenueOfManager } from 'src/api/venue/get-venuenbyAccount'

export function useVenueTable(columns: ColumnDef<IVenue>[], userId: string) {
  const [queries, setQueries] = useState<Partial<IQueryPagination & IQuerySearch> & { [key: string]: any }>({
    PageIndex: 0,
    PageSize: 5,
  })

  const queryController = useQuery<IResponse<IVenue[]>, AxiosError>(
    [...API_GET_ALL_USER_QUERY_KEYS, queries],
    () => GetVenueOfManager(userId),
    {
      keepPreviousData: true,
    },
  )

  const table = useReactTable<IVenue>({
    columns,
    data: queryController.data?.Data?.Result || [],
    manualPagination: true,
    initialState: {
      pagination: {
        pageIndex: queries.PageIndex || 1 - 1,
        pageSize: queries.PageSize,
      },
      globalFilter: queries.search,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getCoreRowModel(),
    getFacetedRowModel: getCoreRowModel(),
    getPaginationRowModel: getCoreRowModel(),
  })

  const [tableStates, setTableStates] = useState(table.initialState)

  table.setOptions((prev) => ({
    ...prev,
    state: tableStates,
    pageCount: queryController.data?.Data?.TotalPages || 0,
    onStateChange: setTableStates,
    debugTable: tableStates.pagination.pageIndex > 2,
  }))

  useEffect(() => {
    const otherFilters = tableStates.columnFilters
    setQueries((prev) => ({
      ...prev,
      role: otherFilters?.[2]?.value,
      PageIndex: tableStates.pagination.pageIndex + 1,
      PageSize: tableStates.pagination.pageSize,
      search: tableStates.globalFilter || undefined,
    }))
  }, [
    tableStates.columnFilters,
    tableStates.globalFilter,
    tableStates.pagination.pageIndex,
    tableStates.pagination.pageSize,
  ])

  useEffect(() => {
    if (!queryController.data?.Data) return

    const pageCount = queryController.data?.Data?.TotalPages || 0
    table.setPageCount(pageCount)
  }, [queryController.data?.Data, table])

  return {
    ...queryController,
    table,
    tableStates,
    setTableStates,
  }
}
