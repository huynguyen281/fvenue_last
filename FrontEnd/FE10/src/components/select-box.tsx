import React from 'react'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { SelectDataBox } from 'src/types/common'

export function SelectBox({ label, data, disabled, onSelection }: SelectDataBox) {
  const [value, setValue] = React.useState('')
  const handleChange = (event: SelectChangeEvent) => {
    const newData = event.target.value
    setValue(newData as string)
    onSelection(newData)
  }
  return (
    <Box className="w-full">
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={label}
          onChange={handleChange}
        >
          {data.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
