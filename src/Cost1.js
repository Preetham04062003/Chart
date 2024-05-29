

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Cost1 = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterOption, setFilterOption] = useState('monthly');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [filterOption, data]);

  const fetchData = async () => {
    try {
      const response = await fetch('/data.json');
      const jsonData = await response.json();
      setData(jsonData);
      setFilteredData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filterData = () => {
    if (filterOption === 'monthly') {
      setFilteredData(data);
    } else if (filterOption === 'yearly') {
      const yearlyData = data.reduce((acc, curr) => {
        const year = curr.year;
        const existingYear = acc.find((item) => item.year === year);
        if (existingYear) {
          existingYear.cost +=curr.cost;
          existingYear.cost1 +=curr.cost1;
          existingYear.cost2 +=curr.cost2;
          existingYear.cost3 +=curr.cost3;
        } else {
          acc.push({ year, cost: curr.cost, cost1: curr.cost1, cost2: curr.cost2, cost3: curr.cost3 });
        }
        return acc;
      }, []);
      setFilteredData(yearlyData);
    }

    else if (filterOption === 'range') {
        const ranges = [
          { start: 'January', end: 'June', year: 2023 },
          { start: 'July', end: 'December', year: 2023 },
          { start: 'January', end: 'June', year: 2024 },
          { start: 'July', end: 'December', year: 2024 }
        ];
  
        const rangeData = ranges.map(({ start, end, year }) => {
          const startIndex = data.findIndex(item => item.month === start && item.year === year);
          const endIndex = data.findIndex(item => item.month === end && item.year === year);
          
          const rangeItems = data.slice(startIndex, endIndex + 1);
          
          return rangeItems.reduce((acc, curr) => {
            acc.cost += curr.cost;
            acc.cost1 += curr.cost1;
            acc.cost2 += curr.cost2;
            acc.cost3 += curr.cost3;
            return acc;
          }, { range: `${start} to ${end} ${year}`, cost: 0, cost1: 0, cost2: 0, cost3: 0 });
        });
  
        setFilteredData(rangeData);
      }
  };

  return (
    <div>
      <select value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
        <option value="range">Date Range</option>
      </select>

      <BarChart width={2000} height={500} data={filteredData}>
        <XAxis dataKey={filterOption === 'yearly' ? 'year' : (filterOption === 'range' ? 'range' : 'month')} />
        <YAxis />
        <Tooltip/>
        <Legend />
        <Bar dataKey="cost" stackId="a" fill="blue" />
        <Bar dataKey="cost1" stackId="a" fill="red" />
        <Bar dataKey="cost2" stackId="a" fill="green" />
        <Bar dataKey="cost3" stackId="a" fill="yellow" />
      </BarChart>
    </div>
  );
};

export default Cost1;
