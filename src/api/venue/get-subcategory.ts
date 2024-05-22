import { axiosClient } from 'src/lib/axios'
import { SubCategory } from 'src/types/subcategory'

export function getAllSubCategories(): Promise<SubCategory[]> {
  return axiosClient.get('SubCategoriesAPI/GetSubCategoryDTOs', {}).then((res) => res.data.Data)
}
