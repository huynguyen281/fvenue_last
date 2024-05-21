import React from 'react'
import TableSizeSelector from 'src/components/ui/table-size-selector'
import { Button } from '../ui/button'
import { DataTable } from '../ui/data-table'
import Paginition from 'src/components/ui/pagination'
import { Skeleton } from '../ui/skeleton'
import { useVenueTable } from './useVenueTable'
import { columns } from './venue-table-column'
import { VenueTableToolbar } from 'src/components/venue-crud/venue-table-toolbar'

function VenueTable() {
  const userString: string | null = localStorage.getItem('user')
  const user = userString && JSON.parse(userString)
  const userId = user && user.Id
  const { isError, isLoading, table, error, refetch, data, tableStates } = useVenueTable(columns, userId)
  console.log('data', data?.Data?.Result)
  const renderFooter = React.useMemo(() => {
    if (isLoading)
      return (
        <div className="flex justify-end gap-2 px-3 py-1.5">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      )
    return (
      <>
        <Paginition
          currentPage={tableStates.pagination.pageIndex + 1}
          totalPage={data?.Data?.TotalPages || 1}
          onPageChange={(index) => {
            table.setPageIndex(index - 1)
          }}
          onNextPage={() => {
            table.nextPage()
          }}
          onPreviousPage={() => {
            table.previousPage()
          }}
        />
        <TableSizeSelector
          className="max-w-[100px] "
          defaultSize={table.getState().pagination.pageSize}
          onChange={(value) => {
            table.setPageSize(value)
          }}
        />
      </>
    )
  }, [isLoading, tableStates.pagination.pageIndex, table, data])

  const renderHeader = React.useMemo(() => {
    return (
      <VenueTableToolbar
        table={table}
        queries={{
          page: tableStates.pagination.pageIndex + 1,
          pageSize: tableStates.pagination.pageSize,
          search: tableStates.globalFilter,
        }}
        setSearchQuery={(value) => {
          table.setGlobalFilter(value.search)
        }}
      />
    )
  }, [table, tableStates.pagination.pageIndex, tableStates.pagination.pageSize, tableStates.globalFilter])

  return (
    <div className="mt-8">
      {isError && <Button onClick={() => refetch()}>Thử lại</Button>}
      {isError && <p>{error?.message}</p>}
      <DataTable
        table={table}
        isLoading={isLoading}
        header={renderHeader}
        columns={columns}
        data={data?.Data?.Result || []}
        footer={<div className="flex justify-end gap-2 px-3 py-1.5">{renderFooter}</div>}
      />
    </div>
  )
}

export default VenueTable
