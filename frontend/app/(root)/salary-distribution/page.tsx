'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const priorities = {
  "Savings First": [20, 10, 15, 5, 10, 30, 5, 5],
  "Essential Needs First": [30, 15, 20, 5, 10, 10, 5, 5],
  "Balanced Approach": [25, 15, 15, 10, 10, 15, 5, 5],
  "Luxury First": [15, 10, 20, 20, 15, 5, 10, 5],
};

const categories = [
  "Rent & Bills", "EMI's & Insurances", "Food", "Shopping", "Transportation", "Investment & Savings", "Miscellaneous", "Monthly Buffer"
];

export default function SalaryDistribution() {
  const { register, handleSubmit } = useForm();
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { label: string; data: number[]; backgroundColor: string[]; borderColor: string[]; borderWidth: number }[];
  } | null>(null);

  const onSubmit = (data: any) => {
    const salary = parseFloat(data.salary);
    const priority = data.priority as keyof typeof priorities;
    const distribution = priorities[priority].map(percentage => (salary * percentage) / 100);

    setChartData({
      labels: categories,
      datasets: [{
        label: 'Salary Distribution',
        data: distribution,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56', '#C9CBCF'],
        borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
        borderWidth: 2,
      }]
    });
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6 bg-gray-100">
      <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Salary Distribution Calculator</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="number"
            {...register("salary", { required: true })}
            placeholder="Enter Monthly Salary"
            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          />
          <select {...register("priority")} className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500">
            {Object.keys(priorities).map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
          <button type="submit" className="bg-blue-500 text-white p-3 w-full rounded-lg shadow-md hover:bg-blue-600">Submit</button>
        </form>
      </div>

      {chartData && (
        <div className="mt-10 w-full max-w-4xl h-full flex items-center justify-center">
          <Pie 
            data={chartData} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              layout: {
                padding: 20 // Add spacing around the chart
              },
              elements: {
                arc: {
                  borderWidth: 3, // Make slices more visible
                }
              },
              plugins: {
                legend: {
                  labels: {
                    font: {
                      size: 18 // Increase legend font size
                    }
                  }
                },
                tooltip: {
                  titleFont: {
                    size: 16 // Increase tooltip title size
                  },
                  bodyFont: {
                    size: 14 // Increase tooltip content size
                  }
                }
              }
            }} 
          />
        </div>
      )}
    </div>
  );
}
