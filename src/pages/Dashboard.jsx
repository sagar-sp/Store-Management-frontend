import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Package, 
  Users, 
  AlertTriangle, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { api } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="card p-6 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <h3 className="text-2xl font-bold mt-1 dark:text-white">{value}</h3>
      {trend && (
        <div className={`flex items-center mt-2 text-sm ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span className="ml-1 font-medium">{Math.abs(trend)}% from last month</span>
        </div>
      )}
    </div>
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  const chartData = {
    labels: data?.monthlySales.map(s => s.month) || [],
    datasets: [
      {
        label: 'Revenue',
        data: data?.monthlySales.map(s => s.revenue) || [],
        fill: true,
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        borderColor: '#0ea5e9',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Store Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${Number(data?.stats.totalRevenue).toLocaleString()}`} 
          icon={DollarSign} 
          trend={12}
          color="bg-blue-500 shadow-blue-500/20 shadow-lg"
        />
        <StatCard 
          title="Total Products" 
          value={data?.stats.totalProducts} 
          icon={Package} 
          trend={5}
          color="bg-purple-500 shadow-purple-500/20 shadow-lg"
        />
        <StatCard 
          title="Active Customers" 
          value={data?.stats.totalCustomers} 
          icon={Users} 
          trend={-2}
          color="bg-emerald-500 shadow-emerald-500/20 shadow-lg"
        />
        <StatCard 
          title="Low Stock Items" 
          value={data?.stats.lowStockItems} 
          icon={AlertTriangle} 
          color="bg-amber-500 shadow-amber-500/20 shadow-lg"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg dark:text-white">Revenue Growth</h3>
            <select className="bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm px-3 py-1 outline-none dark:text-slate-400">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="h-64">
            <Line 
              data={chartData} 
              options={{ 
                maintainAspectRatio: false,
                scales: { 
                  y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                  x: { grid: { display: false } }
                },
                plugins: { legend: { display: false } }
              }} 
            />
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-lg mb-6 dark:text-white">Top Selling Products</h3>
          <div className="space-y-4">
            {data?.topProducts.map((p, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold dark:text-white">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.sold} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-500 font-bold text-sm">Best Seller</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
