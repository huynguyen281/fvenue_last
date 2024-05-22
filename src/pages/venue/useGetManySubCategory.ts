import { getAllSubCategories } from 'src/api/venue/get-subcategory'
import { SubCategory } from 'src/types/subcategory'
import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query'

export default function useGetAllSubCategory(
  options?: Omit<UseQueryOptions<SubCategory[], unknown>, 'queryKey'>,
): UseQueryResult<SubCategory[], unknown> {
  return useQuery(['category'], () => getAllSubCategories(), options)
}
