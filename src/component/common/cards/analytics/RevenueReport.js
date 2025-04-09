// ** React Imports
import {useState} from 'react'

// ** Third Party Components
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import {
  Card,
  CardTitle,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledButtonDropdown
} from 'reactstrap'
import {currencyConverter, formatDateAndTime} from "@src/resources/constants";

const RevenueReport = props => {
  const report = props.dataSet;
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  let yearArray = [];
  let totalPrice = 0;
  // console.log(report)
  if (report.length > 0) {
    yearArray = [...new Set(report.map(item => formatDateAndTime(item.PaymentDate, 'year_only')))]
    totalPrice = report.filter(e=>e.PaymentYear === selectedYear).reduce((accumulator, object) => {return accumulator + object.Amount;}, 0)
  }


  // ** State
  const [data, setData] = useState({
    "years": yearArray,
    "price": currencyConverter(totalPrice)
  })

  const handleOnYearChange = (year) => {
    setSelectedYear(year)
    setData({
      ...data,
      price: currencyConverter(report.filter(e=>e.PaymentYear === year).reduce((accumulator, object) => {return accumulator + object.Amount;}, 0))
    })
  }


  const revenueOptions = {
      chart: {
        stacked: true,
        type: 'bar',
        toolbar: { show: false }
      },
      grid: {
        padding: {
          top: -20,
          bottom: -10
        },
        yaxis: {
          lines: { show: false }
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          style: {
            colors: '#b9b9c3',
            fontSize: '0.86rem'
          }
        },
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        }
      },
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      colors: [props.primary, props.warning],
      plotOptions: {
        bar: {
          columnWidth: '17%',
          borderRadius: [4],
          borderRadiusWhenStacked: 'all',
          borderRadiusApplication: 'start'
        },
        distributed: true
      },
      yaxis: {
        labels: {
          style: {
            colors: '#b9b9c3',
            fontSize: '0.86rem'
          }
        }
      }
    },
    revenueSeries = [
      {
        name: 'Earning',
        data: [
          report.filter(e=>e.PaymentYear === selectedYear && e.PaymentMonth === 1).reduce((accumulator, object) => {return accumulator + object.Amount;}, 0),
          report.filter(e=>e.PaymentYear === selectedYear && e.PaymentMonth === 2).reduce((accumulator, object) => {return accumulator + object.Amount;}, 0),
          report.filter(e=>e.PaymentYear === selectedYear && e.PaymentMonth === 3).reduce((accumulator, object) => {return accumulator + object.Amount;}, 0),
          report.filter(e=>e.PaymentYear === selectedYear && e.PaymentMonth === 4).reduce((accumulator, object) => {return accumulator + object.Amount;}, 0),
          report.filter(e=>e.PaymentYear === selectedYear && e.PaymentMonth === 5).reduce((accumulator, object) => {return accumulator + object.Amount;}, 0),
          report.filter(e=>e.PaymentYear === selectedYear && e.PaymentMonth === 6).reduce((accumulator, object) => {return accumulator + object.Amount;}, 0),
          report.filter(e=>e.PaymentYear === selectedYear && e.PaymentMonth === 7).reduce((accumulator, object) => {return accumulator + object.Amount;}, 0),
          report.filter(e=>e.PaymentYear === selectedYear && e.PaymentMonth === 8).reduce((accumulator, object) => {return accumulator + object.Amount;}, 0),
          report.filter(e=>e.PaymentYear === selectedYear && e.PaymentMonth === 9).reduce((accumulator, object) => {return accumulator + object.Amount;}, 0),
          report.filter(e=>e.PaymentYear === selectedYear && e.PaymentMonth === 10).reduce((accumulator, object) => {return accumulator + object.Amount;}, 0),
          report.filter(e=>e.PaymentYear === selectedYear && e.PaymentMonth === 11).reduce((accumulator, object) => {return accumulator + object.Amount;}, 0),
          report.filter(e=>e.PaymentYear === selectedYear && e.PaymentMonth === 12).reduce((accumulator, object) => {return accumulator + object.Amount;}, 0),
        ]
      }
    ]

  const budgetSeries = [
      {
        data: [61, 48, 69, 52, 60, 40, 79, 60, 59, 43, 62]
      },
      {
        data: [20, 10, 30, 15, 23, 0, 25, 15, 20, 5, 27]
      }
    ],
    budgetOptions = {
      chart: {
        toolbar: { show: false },
        zoom: { enabled: false },
        type: 'line',
        sparkline: { enabled: true }
      },
      stroke: {
        curve: 'smooth',
        dashArray: [0, 5],
        width: [2]
      },
      colors: [props.primary, '#dcdae3'],
      tooltip: {
        enabled: false
      }
    }

  return data !== null ? (
    <Card className='card-revenue-budget'>
      <Row className='mx-0'>
        <Col className='revenue-report-wrapper' md='8' xs='12'>
          <div className='d-sm-flex justify-content-between align-items-center mb-3'>
            <CardTitle className='mb-50 mb-sm-0'>Revenue Report</CardTitle>
          </div>
          <Chart id='revenue-report-chart' type='bar' height='230' options={revenueOptions} series={revenueSeries} />
        </Col>
        <Col className='budget-wrapper' md='4' xs='12'>
          <UncontrolledButtonDropdown>
            <DropdownToggle className='budget-dropdown' outline color='primary' size='sm' caret>
              {selectedYear}
            </DropdownToggle>
            <DropdownMenu>
              {data.years.map(item => (
                <DropdownItem className='w-100' key={item} onClick={()=>handleOnYearChange(item)}>
                  {item}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledButtonDropdown>
          <h2 className='mb-25'>{data.price}</h2>
        </Col>
      </Row>
    </Card>
  ) : null
}

export default RevenueReport
