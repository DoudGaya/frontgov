// ** React Imports
import {useContext, useEffect, useState} from 'react'

// ** Third Party Components
import axios from 'axios'
import Chart from 'react-apexcharts'
import { Circle } from 'react-feather'

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'
import {ThemeColors} from "@src/utility/context/ThemeColors";

const ProductOrders = ({title, values, label, total}) => {
  const { colors } = useContext(ThemeColors)
  // ** State
  const data = {
    "chart_info": {
      "finished": 23043,
      "pending": 14658,
      "rejected": 4758
    }
  }

  const options = {
      labels: label,
      plotOptions: {
        radialBar: {
          size: 150,
          hollow: {
            size: '20%'
          },
          track: {
            strokeWidth: '100%',
            margin: 15
          },
          dataLabels: {
            value: {
              fontSize: '1rem',
              colors: '#5e5873',
              fontWeight: '500',
              offsetY: 5
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '1.286rem',
              colors: '#5e5873',
              fontWeight: '500',

              formatter() {
                // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                return total
              }
            }
          }
        }
      },
      stroke: {
        lineCap: 'round'
      },
      chart: {
        height: 355,
        dropShadow: {
          enabled: true,
          blur: 3,
          left: 1,
          top: 1,
          opacity: 0.1
        }
      }
    },
    series = values

  return data !== null ? (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <Chart options={options} series={series} type='radialBar' height={325} />
      </CardBody>
    </Card>
  ) : null
}
export default ProductOrders
