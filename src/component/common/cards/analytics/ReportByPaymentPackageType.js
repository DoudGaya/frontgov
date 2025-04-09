// ** React Imports
import { useEffect, useState } from 'react'

// ** Third Party Components
import axios from 'axios'
import Chart from 'react-apexcharts'

// ** Utils
import { kFormatter } from '@utils'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Button,
  CardBody,
  CardText,
  Progress,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'
import {currencyConverter} from "@src/resources/constants";

const ReportByPaymentPackageType = props => {
  const report = props.dataSet;
  const totalAmount = report.reduce((accumulator, object) => {return accumulator + object.Amount;}, 0);
  const packageName = report.length > 0 ? [...new Set(report.map(item => item.PackageName))] : [];
  let payment_value = [];
  if (packageName.length > 0) {
    packageName.map(m => {
      payment_value.push(report.filter(e=>e.PackageName === m).reduce((accumulator, object) => {return accumulator + object.Amount;}, 0))
    })
  }

  const color_list = ['progress-bar-primary','progress-bar-warning','progress-bar-success', 'progress-bar-info', 'progress-bar-danger'];
  // ** States

  const options = {
      chart: {
        sparkline: { enabled: true },
        toolbar: { show: false }
      },
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0
        }
      },
      states: {
        hover: {
          filter: 'none'
        }
      },
      colors: ['#ebf0f7', '#ebf0f7', props.primary, '#ebf0f7', '#ebf0f7', '#ebf0f7'],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
          borderRadius: 8,
          borderRadiusApplication: 'end'
        }
      },
      tooltip: {
        x: { show: false }
      },
      xaxis: {
        type: 'numeric'
      }
    },
    series = [
      {
        name: 'Package Name',
        data: payment_value
      }
    ]

  return report.length > 0 ? (
    <Card>
      <CardBody>
        <Row className='pb-50'>
          <Col
            sm={{ size: 6, order: 1 }}
            xs={{ order: 2 }}
            className='d-flex justify-content-between flex-column mt-lg-0 mt-2'
          >
            <div className='session-info mb-1 mb-lg-0'>
              <h2 className='fw-bold mb-25'>{kFormatter(totalAmount)}</h2>
              <CardText className='fw-bold mb-2'>By Package</CardText>
            </div>
          </Col>
          <Col
            sm={{ size: 6, order: 2 }}
            xs={{ order: 1 }}
            className='d-flex justify-content-between flex-column text-end'
          >
            <Chart options={options} series={series} type='bar' height={200} />
          </Col>
        </Row>
        <hr />
        <Row className='pt-50'>
          {
              packageName.length > 0 &&
              packageName.map((method, i) => {
                const paymentTotal = report.filter(e=>e.PackageName === method).reduce((accumulator, object) => {return accumulator + object.Amount;}, 0);
                const percentage = (paymentTotal/totalAmount)*100
                return (
                    <Col key={i} className='mb-2' md='6' sm='12'>
                      <p className='mb-50'>{method}: {currencyConverter(paymentTotal)}</p>
                      <Progress className={`avg-session-progress mt-25 ${color_list[i]}`} value={percentage} />
                    </Col>
                )
              })
          }
        </Row>
      </CardBody>
    </Card>
  ) : null
}
export default ReportByPaymentPackageType
