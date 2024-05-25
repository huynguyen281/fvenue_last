import LandingLayout from '../layout/LandingLayout'
import CarouselLD from 'src/components/carousel/carousel'
import FeeVenue from 'src/components/landing/feeVenue'
import PublicVenue from 'src/components/landing/publicVenue'
import ScheduleExplore from 'src/components/landing/schedule-explore'
function LandingPage() {
  return (
    <LandingLayout>
      <>
        <div className="bg-gray-100 pb-8">
          <CarouselLD />

          <ScheduleExplore />

          <PublicVenue />

          <FeeVenue />
        </div>
      </>
    </LandingLayout>
  )
}
export default LandingPage
