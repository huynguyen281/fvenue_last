import React from 'react'
import Header from 'src/components/header'
import Footer from 'src/components/footer'

import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import { axiosClient } from 'src/lib/axios'
import { SelectData } from 'src/types/common'
import { ListSchedule } from 'src/components/schedule/list-schedule'
import { Schedule, ScheduleRequest, ScheduleResponse } from 'src/types/schedule'
import { SelectBox } from 'src/components/select-box'
import { User } from 'src/types/user'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export default function Schedules() {
  const currentUser = JSON.parse(localStorage.getItem('user') ?? '') as User
  const [districtData, setDistrictData] = React.useState<Array<SelectData>>()
  const [venueCateData, setVenueCateData] = React.useState<Array<SelectData>>()
  const [timeData] = React.useState<Array<SelectData>>([
    { name: 'Tất cả', value: 0 },
    { name: 'Sáng', value: 1 },
    { name: 'Chiều', value: 2 },
    { name: 'Tối', value: 3 },
  ])
  const [scheduleRequest] = React.useState<ScheduleRequest>({
    type: null,
    districtId: null,
    subCategoryIds: null,
  })
  const [schedulesData, setSchedulesData] = React.useState<Array<Schedule>>()
  const [geolocation, setGeolocation] = React.useState<string>()

  const [tab, setTab] = React.useState(0)
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  React.useEffect(() => {
    fetchDistrictData()
    fetchCategoryData()
  }, [])

  React.useEffect(() => {
    fetchScheduleData()
  }, [tab])

  const fetchDistrictData = () => {
    axiosClient
      .get('LocationAPI/GetDistricts')
      .then((response) => {
        if (response.status === 200) {
          const data = [] as Array<SelectData>
          data.push({
            value: 0,
            name: 'Tất cả',
          })
          response.data.forEach((item: any) => {
            data.push({
              value: item.Id as number,
              name: item.Name,
            })
          })
          setDistrictData(data)
        }
      })
      .catch(() => {
        setDistrictData([{ name: 'Tất cả', value: 0 }])
      })
  }

  const fetchCategoryData = () => {
    axiosClient
      .get('SubCategoriesAPI/GetSubCategoryDTOs')
      .then((response) => {
        if (response.status === 200) {
          const data = [] as Array<SelectData>
          response.data?.Data.forEach((item: any) => {
            data.push({
              value: item.Id as number,
              name: item.Name,
            })
          })
          setVenueCateData(data)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  function getCoords() {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
        if (result.state === 'granted') {
          navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords
            setGeolocation(`${latitude},${longitude}`)
          })
        }
      })
    } else {
      alert('Sorry Not available!')
    }
  }

  const fetchScheduleData = () => {
    let apiURL = ''
    let queryString = {}
    switch (tab) {
      case 0: // Khám phá lịch trình
        apiURL = 'SchedulesAPI/GetVenueScheduleByFilter'
        queryString = {
          districtId: scheduleRequest.districtId == 0 ? null : scheduleRequest.districtId,
          type: scheduleRequest.type == 0 ? null : scheduleRequest.type,
          subCategoryIds: scheduleRequest.subCategoryIds,
        }
        break
      case 1: // Lịch trình gợi ý
        // getCoords()
        apiURL = 'SchedulesAPI/SuggestSchedule'
        queryString = {
          AccountId: currentUser.Id,
          GeoLocation: geolocation,
          Type: scheduleRequest.type == 0 ? null : scheduleRequest.type,
          SubCategoryIds: scheduleRequest.subCategoryIds,
          Price: 100000,
        }
        return
      case 2: // Lịch trình của tôi
        apiURL = 'SchedulesAPI/GetVenueSchedule/a'
        queryString = {
          districtId: scheduleRequest.districtId == 0 ? null : scheduleRequest.districtId,
          type: scheduleRequest.type == 0 ? null : scheduleRequest.type,
          subCategoryIds: scheduleRequest.subCategoryIds,
        }
        return
      default:
        break
    }
    const token = `Bearer ${localStorage.getItem('token')}`
    axiosClient
      .post<ScheduleResponse>(apiURL, queryString, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          setSchedulesData(response.data.Data)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    if (event.target.checked) {
      scheduleRequest.subCategoryIds = scheduleRequest.subCategoryIds ?? []
      scheduleRequest.subCategoryIds.push(+newValue)
    } else {
      const filteredArray = scheduleRequest.subCategoryIds?.filter((item) => item.toString() !== newValue)
      scheduleRequest.subCategoryIds = filteredArray ?? []
    }
    fetchScheduleData()
  }

  return (
    <>
      <Header></Header>
      <div className="flex w-full items-center justify-center py-8">
        <div className="flex w-[1100px] gap-4">
          <div className="h-fit w-[25%] space-y-6 rounded-lg border p-3">
            <div className="space-y-2">
              <span className="text-sm font-bold uppercase text-blue-900">Địa điểm khám phá</span>
              <div>
                <SelectBox
                  label="Quận"
                  data={districtData ?? []}
                  disabled={tab === 1}
                  onSelection={(value) => {
                    scheduleRequest.districtId = value as number
                    console.log(scheduleRequest)
                    fetchScheduleData()
                  }}
                ></SelectBox>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-bold uppercase text-blue-900">Thời gian</span>
              <div>
                <SelectBox
                  label="Buổi"
                  data={timeData ?? []}
                  disabled={false}
                  onSelection={(value) => {
                    scheduleRequest.type = value as number
                    console.log(scheduleRequest)
                    fetchScheduleData()
                  }}
                ></SelectBox>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-bold uppercase text-blue-900">Sở thích</span>
              <div className="max-h-[300px] overflow-auto">
                <FormGroup>
                  {venueCateData?.map((item) => (
                    <FormControlLabel
                      key={item.value}
                      control={<Checkbox value={item.value} onChange={handleChangeCheckbox} color="default" />}
                      label={item.name}
                    />
                  ))}
                </FormGroup>
              </div>
            </div>
          </div>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tab} onChange={handleChangeTab} aria-label="basic tabs example">
                <Tab label="Khám phá" {...a11yProps(0)} />
                <Tab label="Gợi ý chuyên gia" {...a11yProps(1)} />
                <Tab label="Lịch trình của tôi" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={tab} index={0}>
              <ListSchedule schedulesData={schedulesData ?? []}></ListSchedule>
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={1}>
              {/* <ListSchedule isPersonal></ListSchedule> */}
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={2}>
              {/* <ListSchedule isPersonal></ListSchedule> */}
            </CustomTabPanel>
          </Box>
        </div>
      </div>
      <Footer></Footer>
    </>
  )
}
