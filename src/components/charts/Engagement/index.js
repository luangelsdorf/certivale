import styles from './Engagement.module.scss';
import dynamic from 'next/dynamic';

export default function Engagement({ content }) {
  const options = {
    chart: {
      width: '100%',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      },
      shadow: {
        enabled: false,
      },
    },
    stroke: {
      width: 7,
      curve: 'smooth'
    },
    xaxis: {
      labels: {
        format: 'MMM',
        style: {
          colors: '#8898aa',
          fontSize: '14px',
          fontFamily: 'REM',
          cssClass: 'apexcharts-xaxis-label',
        },
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: true,
        borderType: 'solid',
        color: '#dee2e6',
        height: 6,
        offsetX: 0,
        offsetY: 0
      },
      type: 'datetime',
      categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000', '7/11/2000', '8/11/2000'],
    },
    yaxis: {
      labels: {
        style: {
          colors: '#8898aa',
          fontSize: '12px',
          fontFamily: 'REM',
        },
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: true,
        borderType: 'solid',
        color: '#dee2e6',
        height: 6,
        offsetX: 0,
        offsetY: 0
      }
    },
    fill: {
      type: 'solid'
    },
    markers: {
      size: 4,
      opacity: 0.7,
      strokeColor: "#fff",
      strokeWidth: 3,
      hover: {
        size: 7,
      }
    },
    grid: {
      borderColor: '#dee2e6',
      strokeDashArray: 5,
    },
    dataLabels: {
      enabled: false
    },
  };

  const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

  return (
    <Chart
      options={options}
      width="100%"
      height="350"
      series={[{
        name: 'Likes',
        data: [4, 3, 10, 9, 29, 19, 22, 9]
      }]}
    />
  )
}
