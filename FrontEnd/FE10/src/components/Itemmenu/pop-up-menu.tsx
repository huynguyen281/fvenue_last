import React, { useState } from 'react'
import { User } from 'src/types/user'
import { SelectBox } from '../select-box'
import { SelectData } from 'src/types/common'
import { axiosClient } from 'src/lib/axios'
import Collapse from '@mui/material/Collapse'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { TicketCategory, TicketCategoryResponse } from 'src/types/ticket'
import { IPaymentQuery } from 'src/types/payment'
import { PaymentType } from 'src/enums/payment-type'

interface CollapseType {
  open: boolean
  value: number
}

// Ngân hàng: NCB
// Số thẻ: 9704198526191432198
// Tên chủ thẻ: NGUYEN VAN A
// Ngày phát hành: 07/15

const formatCurrency = (value: number) => {
  return value.toLocaleString('vi', { style: 'currency', currency: 'VND' })
}

export default function Popupmenu({ venueId, venueName }: { venueId: string; venueName: string }) {
  const currentUser = JSON.parse(localStorage.getItem('user') ?? '') as User

  const [open, setOpen] = React.useState<Array<CollapseType>>([])
  const [showModal, setShowModal] = useState(false)
  const [dateTicket, setDateTicket] = React.useState<Array<SelectData>>([])
  const [ticketCategory, setTicketCategory] = React.useState<Array<TicketCategory>>([])
  const [ticketChosen, setTicketChosen] = React.useState<Array<string>>([])
  const [totalPrice, setTotalPrice] = React.useState<number>(0)

  React.useEffect(() => {
    fetchDateTicketData()
  }, [])

  const fetchDateTicketData = () => {
    axiosClient
      .get(`ItemsAPI/GetItemTicketDateAvailable/${venueId}`)
      .then((response) => {
        if (response.status === 200 && response.data.Data) {
          const data = [] as Array<SelectData>
          const keyValueArray = Object.keys(response.data.Data).map((key) => ({
            key,
            value: response.data.Data[key],
          }))
          keyValueArray.forEach((item: any) => {
            const dateFormat = new Intl.DateTimeFormat('vi', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }).format(new Date(item.key))
            data.push({
              value: item.key,
              name: `${dateFormat} - Còn trống ${item.value} vé`,
            })
          })
          setDateTicket(data)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const fetchTicketData = (dateChoose: string | number) => {
    const token = `Bearer ${localStorage.getItem('token')}`
    axiosClient
      .post<TicketCategoryResponse>(
        `ItemsAPI/GetItemTicketsByDate`,
        {
          VenueId: venueId,
          Date: dateChoose,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        },
      )
      .then((response) => {
        if (response.status === 200 && response.data.Data) {
          response.data.Data.forEach((item) => {
            open.push({
              open: false,
              value: item.Id,
            })
          })
          setTicketCategory(response.data.Data)
          setTotalPrice(0)
          setTicketChosen([])
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const ticketPick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.name
    const price = event.target.value
    if (event.target.checked) {
      ticketChosen.push(newValue)
      setTotalPrice(totalPrice + +price)
    } else {
      const filteredArray = ticketChosen?.filter((item) => item !== newValue)
      setTicketChosen(filteredArray)
      setTotalPrice(totalPrice - +price)
    }
  }

  const handlePayment = async () => {
    if (totalPrice == 0 || ticketChosen.length < 1) return
    const token = `Bearer ${localStorage.getItem('token')}`
    const dataQuery = {
      UserId: currentUser.Id,
      Amount: totalPrice,
      PaymentType: PaymentType.Item,
      BankCode: 'NCB',
      Content: ticketChosen.join('#'),
      Locale: 'vn',
    } as IPaymentQuery
    console.log(dataQuery)
    axiosClient
      .post(`PaymentsAPI/PaymentTransaction`, dataQuery, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          window.open(response.data.Data, '_blank')
        }
      })
  }

  return (
    <>
      <button
        className="mb-1 mr-1 rounded bg-blue-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-pink-600"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Đặt Vé
      </button>
      {showModal && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="relative mx-auto my-6 w-[550px] max-w-7xl rounded-full">
              <div className="relative flex max-h-[720px] w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                <div className="border-blueGray-200 flex items-start justify-between rounded-t border-b border-solid p-5">
                  <h3 className="justify-center text-3xl font-semibold">{venueName}</h3>
                  <button
                    className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-black-700 block h-6  w-6 text-2xl ">×</span>
                  </button>
                </div>
                <div className="relative flex-auto overflow-auto p-6">
                  <div className="mb-4 text-lg font-semibold">Chọn thời gian</div>
                  <div className="mb-4">
                    <SelectBox
                      label="Ngày"
                      data={dateTicket ?? []}
                      onSelection={(value) => {
                        fetchTicketData(value)
                      }}
                    ></SelectBox>
                  </div>
                  <div>
                    {ticketCategory?.map((item) => (
                      <div className="mb-4" key={item.Id}>
                        <div
                          onClick={() => {
                            const targetIndex = open.findIndex((itemOpen) => itemOpen.value == item.Id)
                            if (targetIndex !== -1) {
                              const updatedOpen = [...open]
                              updatedOpen[targetIndex] = { open: !updatedOpen[targetIndex].open, value: item.Id }
                              setOpen(updatedOpen)
                            }
                          }}
                          className="flex w-full cursor-pointer items-center justify-between rounded-sm border bg-gray-200/60 p-2"
                        >
                          <span>{`${item.ItemTickets.length} ${item.Name}`}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-bold">{formatCurrency(item.Price)} / vé</span>
                            {!open.some((openValue) => openValue.value === item.Id && openValue.open) ? (
                              <ExpandLess className="text-blue-950" />
                            ) : (
                              <ExpandMore className="text-blue-950" />
                            )}
                          </div>
                        </div>
                        <Collapse
                          in={open.some((openValue) => openValue.value == item.Id && openValue.open)}
                          timeout="auto"
                          unmountOnExit
                          className="ml-6 border border-t-0 bg-gray-100/60 px-3"
                        >
                          <FormGroup>
                            {item.ItemTickets?.map((ticket) => (
                              <FormControlLabel
                                key={ticket}
                                control={
                                  <Checkbox
                                    checked={ticketChosen.some((ticketValue) => ticketValue == ticket)}
                                    value={item.Price}
                                    name={ticket}
                                    onChange={ticketPick}
                                    color="default"
                                  />
                                }
                                label={`${ticket}`}
                              />
                            ))}
                          </FormGroup>
                        </Collapse>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-blueGray-200 flex flex-row items-center justify-center gap-5 rounded-b border-t border-solid p-6">
                  <div>
                    <span className="font-bold">Tổng tiền: </span>
                    <span>{formatCurrency(totalPrice)} </span>(
                    <span className="font-semibold">{ticketChosen.length} vé</span>)
                  </div>
                  <button
                    className="mb-1 mr-1 justify-center rounded bg-blue-500 px-2 py-1  text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                    type="button"
                    onClick={handlePayment}
                  >
                    Đặt vé ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      )}
    </>
  )
}
