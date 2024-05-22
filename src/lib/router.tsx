import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Formcrudvenue from 'src/components/venue-crud/FormCrud-venue'
import { Popup } from 'src/pages/venue/Popup'
const VenueTable = React.lazy(() => import('src/components/venue-crud/venue-table'))
const MainLayout = React.lazy(() => import('../pages/layout/MainLayout'))
const LandingPage = React.lazy(() => import('src/pages/landing'))
const VenueDetailPage = React.lazy(() => import('src/pages/venue/VenueDetailPage'))
const AuthLayout = React.lazy(() => import('src/pages/layout/AuthLayout'))
const LoginPage = React.lazy(() => import('src/pages/(auth)/login/SignInPage'))
const SignUpPage = React.lazy(() => import('src/pages/(auth)/register/SignUpPage'))
const Profile = React.lazy(() => import('src/pages/(auth)/profile/Profile'))
const Venues = React.lazy(() => import('src/pages/venue/Venues'))
const Geolocation = React.lazy(() => import('src/pages/venue/Geolocation'))
const ScheduleDetail = React.lazy(() => import('src/pages/schedule/detail'))
const Schedules = React.lazy(() => import('src/pages/schedule/index'))
const SuggestionStep = React.lazy(() => import('src/pages/schedule/suggestion-step'))

export const ROUTES = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
    ],
  },
  {
    path: '/venue/:id',
    element: <VenueDetailPage />,
  },
  {
    path: '/venues',
    element: <Venues />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/profile/:method',
    element: <Profile />,
  },
  {
    path: '/venueManager',
    element: <VenueTable />,
  },
  {
    path: '/Geolocation',
    element: <Geolocation />,
  },
  {
    path: '/schedule',
    element: <Schedules />,
  },
  {
    path: '/schedule/detail/:id',
    element: <ScheduleDetail />,
  },
  {
    path: '/schedule/suggestion-step',
    element: <SuggestionStep />,
  },
  {
    path: '/popup',
    element: <Popup />,
  },
  {
    path: '/form',
    element: <Formcrudvenue />,
  },

  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <SignUpPage />,
      },
    ],
  },
])
