import Breadcrumb from 'src/components/breadcrumb/breadcrumb'
import MetaData from 'src/components/metadata'
import React from 'react'
import { IBreadcrumb } from 'src/components/breadcrumb'
import VenueList from 'src/components/venues/venue-list'
import Header from 'src/components/header'
import Footer from 'src/components/footer'

function Venues() {
  const breadcrumb = React.useMemo<IBreadcrumb[]>(() => {
    return [
      {
        label: 'Home',
        key: 'home',
        href: '/',
        icon: 'smartHome',
      },
      {
        key: 'venues',
        label: 'Venues',
        href: '/venues',
      },
    ]
  }, [])
  return (
    <div>
      <Header></Header>
      <div className="rounded-md border px-8 py-2">
        <MetaData title="Venues" />
        <Breadcrumb items={breadcrumb} className="mb-4 w-full" />
        <VenueList />
      </div>
      <Footer></Footer>
    </div>
  )
}

export default Venues
