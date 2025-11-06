import React, { useState } from "react";
import { getAllHandler } from "../utils/FetchHandlers";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import LoadingComTwo from "../components/shared/LoadingComTwo";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import {
  MdOutlineStackedBarChart,
  MdWorkOutline,
  MdPeopleOutline,
} from "react-icons/md";
import { SlGraph } from "react-icons/sl";
import { FaRegBuilding } from "react-icons/fa";

const Stats = () => {
  const [isShowBarChart, setIsShowBarChart] = useState(false);
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["stats"],
    queryFn: () => getAllHandler(`admin/stats`),
    retry: 2,
    retryDelay: 1000,
  });

  // Pi Chart Codes
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (isPending) {
    return <LoadingComTwo />;
  }

  if (isError) {
    console.error("Error loading stats:", error);
    return (
      <div className="text-center mt-12 p-6">
        <h2 className="text-lg md:text-3xl font-bold text-red-600 mb-4">
          Error: {error?.message || "Failed to load statistics"}
        </h2>
        <p className="text-gray-600 mb-4">
          {error?.response?.status === 401 || error?.response?.status === 403
            ? "You don't have permission to view this page. Please make sure you're logged in as an admin."
            : "There was a problem connecting to the server. Please try again later."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Debug the data structure
  console.log("Stats data:", data);

  console.log("Received stats data:", data);

  if (!data?.defaultStats || !data?.monthly_stats) {
    console.warn("Missing required data:", {
      defaultStats: data?.defaultStats,
      monthly_stats: data?.monthly_stats,
      fullData: data,
    });
    return (
      <h2 className="text-lg md:text-3xl font-bold text-amber-600 text-center mt-12">
        No statistics data available
      </h2>
    );
  }
  return (
    <Wrapper>
      <div className="stats-header">
        <h2 className="stats-title">Dashboard Statistics</h2>
        <p className="stats-subtitle">
          Overview of job portal metrics and activities
        </p>
      </div>

      <div className="stats-cards">
        {data?.defaultStats?.map((stat, index) => (
          <div key={stat.name} className="stat-card">
            <div
              className="stat-icon"
              style={{ backgroundColor: `${COLORS[index % COLORS.length]}15` }}
            >
              {index === 0 ? (
                <MdWorkOutline style={{ color: COLORS[index] }} />
              ) : index === 1 ? (
                <MdPeopleOutline style={{ color: COLORS[index] }} />
              ) : (
                <FaRegBuilding style={{ color: COLORS[index] }} />
              )}
            </div>
            <div className="stat-info">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-container">
        <div className="chart-section pie-chart">
          <div className="chart-header">
            <h3 className="chart-title">Distribution Overview</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data?.defaultStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data?.defaultStats?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section trend-chart">
          <div className="chart-header">
            <h3 className="chart-title">Monthly Trends</h3>
            <div
              className="graph-controller"
              onClick={() => setIsShowBarChart(!isShowBarChart)}
              title={
                isShowBarChart ? "Switch to Area Chart" : "Switch to Bar Chart"
              }
            >
              {isShowBarChart ? (
                <SlGraph className="icon" />
              ) : (
                <MdOutlineStackedBarChart className="icon" />
              )}
            </div>
          </div>

          {isShowBarChart ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.monthly_stats}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis allowDecimals={false} stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="rgb(54, 55, 245)"
                  stroke="rgb(44, 45, 235)"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data?.monthly_stats}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis allowDecimals={false} stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  fill="rgb(54, 55, 245)"
                  stroke="rgb(44, 45, 235)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .stats-header {
    margin-bottom: 2rem;
  }

  .stats-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .stats-subtitle {
    color: #6b7280;
    font-size: 1rem;
  }

  .stats-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: #ffffff;
    border-radius: 10px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-2px);
    }
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .stat-info {
    flex: 1;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }

  .stat-label {
    color: #6b7280;
    font-size: 0.875rem;
    text-transform: capitalize;
  }

  .charts-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .chart-section {
    background: #ffffff;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .chart-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
  }

  .graph-controller {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: rgb(54, 55, 245);
    color: white;

    &:hover {
      background-color: rgb(44, 45, 235);
    }

    .icon {
      font-size: 20px;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;

    .stats-title {
      font-size: 1.5rem;
    }

    .stats-cards {
      grid-template-columns: 1fr;
    }

    .charts-container {
      grid-template-columns: 1fr;
    }
  }
`;

export default Stats;
