import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import { SelectData } from 'src/types/common'
import { SelectBox } from 'src/components/select-box'

const steps = ['Chọn thời gian', 'Chọn sở thích', 'Chọn giá', 'Kết quả']

function SuggestionStep() {
  const [activeStep, setActiveStep] = React.useState(1)
  const [timeData] = React.useState<Array<SelectData>>([
    { name: 'Sáng', value: 1 },
    { name: 'Chiều', value: 2 },
    { name: 'Tối', value: 3 },
  ])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-200">
      <div className="w-2/3 rounded-xl bg-white shadow-xl">
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
                <div className="space-y-6 py-3">
                  <div>
                    <SelectBox
                      label="Buổi"
                      data={timeData ?? []}
                      disabled={activeStep != 0}
                      onSelection={(value) => {
                        console.log(value)
                      }}
                    ></SelectBox>
                  </div>
                  <div className={activeStep >= 1 ? 'block' : 'invisible'}>
                    <SelectBox
                      label="Buổi"
                      data={timeData ?? []}
                      disabled={activeStep != 1}
                      onSelection={(value) => {
                        console.log(value)
                      }}
                    ></SelectBox>
                  </div>
                </div>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 1 }}>
                  <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                    <p className="capitalize">Back</p>
                  </Button>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button onClick={handleNext}>
                    <p className="capitalize">{activeStep === steps.length - 1 ? 'Finish' : 'Next'}</p>
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
