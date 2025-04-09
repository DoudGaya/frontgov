// ** React Imports
import {useContext, useEffect, useState} from 'react'

// ** Third Party Components
import axios from 'axios'
import classnames from 'classnames'
import * as Icon from 'react-feather'
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardTitle,
  CardHeader,
} from 'reactstrap'
import {ThemeColors} from "@src/utility/context/ThemeColors";

const Customers = ({items, title}) => {
    const { colors } = useContext(ThemeColors)
  // ** State
  const data = {
      "listData": [
          {
              "icon": "Circle",
              "iconColor": "text-primary",
              "text": items.nameA,
              "result": items.countA
          },
          {
              "icon": "Circle",
              "iconColor": "text-danger",
              "text": items.nameB,
              "result": items.countB
          }
      ]
  }

  const options = {
      chart: {
        toolbar: {
          show: false
        }
      },
      labels: [items.nameA, items.nameB],
      dataLabels: {
        enabled: false
      },
      legend: { show: false },
      stroke: {
        width: 4
      },
      colors: [colors.primary.main, colors.danger.main]
    },
    series = [items.countA, items.countB]

  return data !== null ? (
    <Card>
      <CardHeader className='align-items-end'>
        <CardTitle tag='h4'>{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <Chart options={options} series={series} type='pie' height={325} />
      </CardBody>
    </Card>
  ) : null
}
export default Customers
