import { getAllCategories } from 'src/api/venue/get-category'
import { Category } from 'src/types/category'
import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query'

export default function useGetAllCategory(
  options?: Omit<UseQueryOptions<Category[], unknown>, 'queryKey'>,
): UseQueryResult<Category[], unknown> {
  return useQuery(['category'], () => getAllCategories(), options)
}
