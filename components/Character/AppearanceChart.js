import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';

class AppearanceChart extends React.Component {
  render() {
    const barChartData = {
      labels: this.props.years,
      datasets: this.props.datasets,
    };
    return (
      <div>
        <Bar data={barChartData} options={this.props.options} />
      </div>
    );
  }
}

AppearanceChart.propTypes = {
  options: PropTypes.object,
  title: PropTypes.string.isRequired,
  years: PropTypes.arrayOf(PropTypes.number).isRequired,
  max_year: PropTypes.number,
  datasets: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.number).isRequired,
      backgroundColor: PropTypes.string,
      stack: PropTypes.string,
    })
  ),
};

AppearanceChart.defaultProps = {
  options: {
    responsive: true,
    scales: {
      xAxes: [
        {
          stacked: true,
        },
      ],
      yAxes: [
        {
          stacked: true,
          ticks: {
            suggestedMin: 0,
            suggestedMax: 76, // TODO
          },
        },
      ],
    },
  },
};

export default AppearanceChart;
