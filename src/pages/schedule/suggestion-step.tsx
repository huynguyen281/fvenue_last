import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import { SelectData } from 'src/types/common'
import { SelectBox } from 'src/components/select-box'
import TextField from '@mui/material/TextField'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { axiosClient } from 'src/lib/axios'
import { ScheduleSuggestionRequest } from 'src/types/schedule'

const steps = ['Chọn thời gian', 'Chọn giá tiền mong muốn', 'Chọn sở thích', 'Kết quả']

function SuggestionStep() {
  const [activeStep, setActiveStep] = React.useState(0)
  const [venueCateData, setVenueCateData] = React.useState<Array<SelectData>>()
  const [timeData] = React.useState<Array<SelectData>>([
    { name: 'Sáng', value: 1 },
    { name: 'Chiều', value: 2 },
    { name: 'Tối', value: 3 },
  ])
  const [selectedSubCategory, setSelectedSubCategory] = React.useState<Array<SelectData>>([])
  const [queryGetSuggestion] = React.useState<ScheduleSuggestionRequest>({
    AccountId: 1,
    GeoLocation: '',
    Type: 0,
    SubCategoryIds: [],
    Price: null,
  } as ScheduleSuggestionRequest)
  const [localStatus, setLocalStatus] = React.useState<number>(0)

  React.useEffect(() => {
    // setActiveStep(0)
    fetchCategoryData()
  }, [])

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

  const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = {
      name: event.target.name,
      value: event.target.value,
    } as SelectData
    if (event.target.checked) {
      const newArrayValue = [...selectedSubCategory, ...[newValue]]
      setSelectedSubCategory(newArrayValue)
    } else {
      const filteredArray = selectedSubCategory?.filter((item) => item.value !== newValue.value)
      console.log(filteredArray)
      setSelectedSubCategory(filteredArray)
    }
  }

  const handleRemoveSubCateSelected = (value: SelectData) => {
    // const filteredArray = selectedSubCategory?.filter((item) => item != value)
    // setSelectedSubCategory(filteredArray)
  }

  const handleNext = () => {
    if (activeStep > 3) return
    switch (activeStep) {
      case 0:
        if (queryGetSuggestion.Type == 0) return
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
        break
      case 1:
        if (!queryGetSuggestion.Price) return
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
        break
      case 2:
        if (selectedSubCategory.length < 1) return
        queryGetSuggestion.SubCategoryIds = selectedSubCategory.map((item) => +item.value)
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
        break
      default:
        localStorage.setItem('suggestion_query', JSON.stringify(queryGetSuggestion))
        window.open('/schedule/detail/0')
    }
    return
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  async function locate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude
          queryGetSuggestion.GeoLocation = `${latitude},${longitude}`
          setLocalStatus(1)
        },
        (error) => {
          console.error('Lỗi khi lấy vị trí:', error)
          setLocalStatus(-1)
        },
      )
    } else {
      setLocalStatus(0)
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-300/80">
      <div className="w-[60%] rounded-xl bg-white shadow-xl backdrop-blur-2xl">
        <div className="w-ful p-16">
          <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps: { completed?: boolean } = {}
                const labelProps: {
                  optional?: React.ReactNode
                } = {}
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                )
              })}
            </Stepper>
            <React.Fragment>
              <div className="px-4 pt-8">
                <div className="pb-3 text-xl font-semibold">{steps[activeStep]}</div>
                <div className="space-y-6 py-3 transition-all">
                  <div>
                    <SelectBox
                      label="Buổi"
                      data={timeData ?? []}
                      disabled={activeStep != 0}
                      onSelection={(value) => {
                        queryGetSuggestion.Type = value as number
                      }}
                    ></SelectBox>
                  </div>
                  <div className={activeStep >= 1 ? 'block' : 'hidden'}>
                    <TextField
                      required
                      disabled={activeStep != 1}
                      className="w-full"
                      id="outlined-basic"
                      label="Giá tiền (VND)"
                      variant="outlined"
                      value={queryGetSuggestion.Price}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        if (!isNaN(Number(event.target.value))) queryGetSuggestion.Price = +event.target.value
                      }}
                    />
                  </div>
                  <div className={activeStep >= 2 ? 'block' : 'hidden'}>
                    <FormGroup>
                      <div className="flex flex-wrap gap-[6px] pb-2">
                        {selectedSubCategory?.map((item) => (
                          <div
                            key={item.value}
                            className="w-fit rounded-sm bg-gray-200 px-2 py-1 text-sm font-semibold text-gray-800"
                            onClick={() => handleRemoveSubCateSelected(item)}
                          >
                            {item.name}
                            {/* <Clear className="cursor-pointer" sx={{ fontSize: 12 }} /> */}
                          </div>
                        ))}
                      </div>
                      <div
                        className={
                          activeStep == 2
                            ? 'flex max-h-[210px] flex-wrap gap-2 overflow-auto rounded-sm border px-3'
                            : 'hidden'
                        }
                      >
                        {venueCateData?.map((item) => (
                          <FormControlLabel
                            key={item.value}
                            control={<Checkbox value={item.value} onChange={handleChangeCheckbox} color="default" />}
                            label={item.name}
                            value={item.value}
                            name={item.name}
                          />
                        ))}
                      </div>
                    </FormGroup>
                  </div>
                  <div className={activeStep >= 3 ? 'block w-full' : 'hidden'}>
                    {localStatus == 0 && (
                      <div className="text-md !mt-2 flex flex-col gap-3 rounded-md">
                        <div className="font-semibold text-blue-500">
                          Để hoàn tất quá trình, bạn cần cho phép chúng tôi quyền truy cập vị trí thiết bị của bạn.
                        </div>
                        <span
                          onClick={() => {
                            locate().then(() => {
                              if (queryGetSuggestion.GeoLocation != '') console.log(queryGetSuggestion)
                            })
                          }}
                          className="cursor-pointer rounded-md bg-blue-500 px-2 py-1 text-center text-white hover:shadow-lg"
                        >
                          Thử lại
                        </span>
                      </div>
                    )}
                    {localStatus == 1 && (
                      <div className="text-md !mt-2 flex flex-col gap-3 rounded-md">
                        <div className="font-semibold text-green-500">
                          Quá trình đã hoàn tất, nhấn vào xem kết quả để xem chi tiết lịch trình !
                        </div>
                      </div>
                    )}
                    {localStatus == -1 && (
                      <div className="text-md !mt-2 flex flex-col gap-3 rounded-md">
                        <div className="font-semibold text-red-500">Lấy vị trí thất bại.</div>
                        <span
                          onClick={() => {
                            locate().then(() => {
                              if (queryGetSuggestion.GeoLocation != '') console.log(queryGetSuggestion)
                            })
                          }}
                          className="cursor-pointer rounded-md bg-blue-500 px-2 py-1 text-center text-white hover:shadow-lg"
                        >
                          Thử lại
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 1 }}>
                  <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                    <p className="capitalize">Trở về</p>
                  </Button>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button
                    disabled={activeStep === steps.length - 1 && queryGetSuggestion.GeoLocation == ''}
                    onClick={handleNext}
                  >
                    <p className="capitalize">{activeStep === steps.length - 1 ? 'Xem kết quả' : 'Tiếp'}</p>
                  </Button>
                </Box>
              </div>
            </React.Fragment>
          </Box>
        </div>
      </div>
    </div>
  )
}

export default SuggestionStep
