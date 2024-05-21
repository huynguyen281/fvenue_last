import { CreateSubcategory } from 'src/components/SubcategoryCRUD/Create-Subcategory'
import { ReportVenuePopup } from 'src/components/venue-crud/Report-popup'
import { CreateVenue } from 'src/components/venue-crud/create-venue'
import { DisableVenuePopup } from 'src/components/venue-crud/disable-venue'
// import { UpdateVenue } from 'src/components/venue-crud/update-venue'

export function Popup() {
  return (
    <>
      {/* <UpdateVenue categoryId={''} /> */}
      <CreateVenue />
      <ReportVenuePopup />
      <CreateSubcategory />
      <DisableVenuePopup />
    </>
  )
}
