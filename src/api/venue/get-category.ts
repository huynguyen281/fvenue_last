import { Category } from 'src/types/category'
import { axiosClient } from 'src/lib/axios'

export function getAllCategories(): Promise<Category[]> {
  return axiosClient.get('CategoriesAPI/GetCategoryDTOs', {}).then((res) => res.data.Data)
}
