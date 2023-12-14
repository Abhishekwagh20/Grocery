import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiBarChartHorizontalFill } from 'react-icons/ri'; // Import Bar Chart Icon
import * as d3 from 'd3';

const PaymentAnalytics = () => {
  const [detailedAnalytics, setDetailedAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchDetailedPaymentAnalytics = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_DOMAIN}/payment-detailed-analytics`);
        const data = response.data;
        setDetailedAnalytics(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching detailed payment analytics:', error);
        setLoading(false);
      }
    };

    fetchDetailedPaymentAnalytics();
  }, []);


  const renderPieChart = (data) => {
    // Assuming 'data' is an array of objects with 'itemName' and 'itemPrice' properties

    // Clear previous chart if any
    d3.select('#d3-chart-container').selectAll('*').remove();

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select('#d3-chart-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value((d) => d.itemPrice);
    const dataReady = pie(data);

    const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

    // Add labels to pie chart segments
    const label = d3.arc().innerRadius(radius / 2).outerRadius(radius);

    svg.selectAll('slices')
      .data(dataReady)
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', (d) => color(d.data.itemName))
      .attr('stroke', 'black')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);

    svg.selectAll('slices')
      .data(dataReady)
      .enter()
      .append('text')
      .text((d) => `${d.data.itemName} - $${d.data.itemPrice}`)
      .attr('transform', (d) => `translate(${label.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', '10px');
  };

  const renderBarChart = (data, key, chartTitle) => {
  // Clear previous chart if any
  d3.select('#d3-chart-container').selectAll('*').remove();

  const margin = { top: 20, right: 30, bottom: 70, left: 60 };
  const width = 500 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3
    .select('#d3-chart-container')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(data.map((d) => d[key]))
    .padding(0.2);

  const y = d3.scaleLinear().range([height, 0]).domain([0, d3.max(data, (d) => d.totalSold)]);

  // X-axis
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('transform', 'rotate(-45)')
    .attr('dy', '0.5em') // Adjust text position for better readability
    .attr('dx', '-0.5em'); // Adjust text position for better readability
  svg.append('text')
    .attr('transform', `translate(${width / 2}, ${height + margin.top + 40})`)
    .style('text-anchor', 'middle')
    .text('Product Name'); // X-axis label

  // Y-axis
  svg.append('g').call(d3.axisLeft(y));
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Total Units Sold'); // Y-axis label

  // Bars
  svg.selectAll('bar')
    .data(data)
    .enter()
    .append('rect')
    .style('fill', '#5A9BD4') // Change bar color
    .attr('x', (d) => x(d[key]))
    .attr('width', x.bandwidth())
    .attr('y', (d) => y(d.totalSold))
    .attr('height', (d) => height - y(d.totalSold))
    .on('mouseover', function (event, d) {
      // Tooltip on mouseover
      const tooltip = d3.select('#d3-chart-container').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip.html(`${d.productName}<br/>Units Sold: ${d.totalSold}`)
        .style('left', `${event.pageX}px`)
        .style('top', `${event.pageY - 28}px`);
    })
    .on('mouseout', function () {
      // Remove tooltip on mouseout
      d3.select('.tooltip').remove();
    });
};

  
  

  const handleUserClick = (user) => {
    setSelectedUser(user);
    renderPieChart(user.itemsBought);
  };

  const handleMostSoldProducts = () => {
    const mostSoldProductsData = detailedAnalytics
      .flatMap((user) => user.itemsBought)
      .reduce((acc, item) => {
        const existingItem = acc.find((i) => i.productName === item.itemName);
        if (existingItem) {
          existingItem.totalSold += 1;
        } else {
          acc.push({ productName: item.itemName, totalSold: 1 });
        }
        return acc;
      }, [])
      .sort((a, b) => b.totalSold - a.totalSold);

    renderBarChart(mostSoldProductsData, 'productName');
  };

  const handleMostSoldProductsByAddress = () => {
    const mostSoldProductsByAddressData = detailedAnalytics
      .flatMap((user) => user.itemsBought.map((item) => ({ ...item, userAddress: user.userAddress })))
      .reduce((acc, item) => {
        const existingItem = acc.find((i) => i.productName === item.itemName && i.address === item.userAddress);
        if (existingItem) {
          existingItem.totalSold += 1;
        } else {
          acc.push({ productName: item.itemName, address: item.userAddress, totalSold: 1 });
        }
        return acc;
      }, [])
      .sort((a, b) => b.totalSold - a.totalSold || b.address.localeCompare(a.address)); // Sort by totalSold and then by address in descending order
  
    renderBarChart(mostSoldProductsByAddressData, 'address', 'Most Sold Products by Address');
  };
  
  
  

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Detailed Payment Analytics</h2>

      {loading ? (
        <p>Loading...</p>
      ) : detailedAnalytics.length === 0 ? (
        <p>No detailed payment analytics available.</p>
      ) : (
        detailedAnalytics.map((analytics, index) => (
          <div key={index} style={styles.analyticsContainer}>
            <div
              style={styles.userInformation}
              onClick={() => handleUserClick(analytics)}
              className="user-name-clickable"
            >
              <h3>User Information</h3>
              <p>Name: {analytics.userName}</p>
              <p>Email: {analytics.userEmail}</p>
              <p>Address: {analytics.userAddress}</p>
              <p>Card Number: {analytics.cardNumber}</p>
            </div>

            <div style={styles.itemsBought}>
              <h3>Items Bought</h3>
              <ul>
                {analytics.itemsBought.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    {item.itemName} - ${item.itemPrice}
                  </li>
                ))}
              </ul>
            </div>

            <p style={styles.totalCost}>Total Cost: ${analytics.totalCost}</p>
            <hr style={styles.hr} />
          </div>
        ))
      )}

      <div id="d3-chart-container"></div>

      {/* Buttons for additional functionality */}
      <div style={styles.buttonContainer}>
        <button onClick={handleMostSoldProducts} style={styles.button}>
          <RiBarChartHorizontalFill style={styles.buttonIcon} />
          Most Sold Products
        </button>
        <button onClick={handleMostSoldProductsByAddress} style={styles.button}>
          <RiBarChartHorizontalFill style={styles.buttonIcon} />
          Most Sold Products by Address
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: 'auto',
    padding: '20px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  analyticsContainer: {
    marginBottom: '30px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    background: '#f7f7f7',
  },
  userInformation: {
    marginBottom: '20px',
    cursor: 'pointer', // Add cursor pointer for better user experience
  },
  itemsBought: {
    marginBottom: '20px',
  },
  totalCost: {
    fontSize: '18px',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  hr: {
    border: '1px solid #ddd',
  },
  
};

export default PaymentAnalytics;
