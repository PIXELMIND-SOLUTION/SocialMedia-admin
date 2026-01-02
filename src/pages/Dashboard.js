import React from 'react';
import { 
  FaUsers, 
  FaShoppingCart, 
  FaDollarSign, 
  FaChartLine,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

const Dashboard = ({ darkMode }) => {
  const stats = [
    {
      title: 'Total Users',
      value: '12,458',
      change: '+12.5%',
      trend: 'up',
      icon: <FaUsers className="text-3xl text-blue-500" />,
      color: 'blue'
    },
    {
      title: 'Total Orders',
      value: '3,254',
      change: '+8.2%',
      trend: 'up',
      icon: <FaShoppingCart className="text-3xl text-green-500" />,
      color: 'green'
    },
    {
      title: 'Revenue',
      value: '$45,258',
      change: '-2.3%',
      trend: 'down',
      icon: <FaDollarSign className="text-3xl text-purple-500" />,
      color: 'purple'
    },
    {
      title: 'Growth',
      value: '24.7%',
      change: '+4.1%',
      trend: 'up',
      icon: <FaChartLine className="text-3xl text-orange-500" />,
      color: 'orange'
    }
  ];

  const recentOrders = [
    { id: '#ORD001', customer: 'John Doe', date: '2024-01-15', amount: '$245.99', status: 'Delivered' },
    { id: '#ORD002', customer: 'Jane Smith', date: '2024-01-14', amount: '$1,299.99', status: 'Processing' },
    { id: '#ORD003', customer: 'Robert Johnson', date: '2024-01-14', amount: '$89.50', status: 'Pending' },
    { id: '#ORD004', customer: 'Sarah Williams', date: '2024-01-13', amount: '$545.00', status: 'Delivered' },
    { id: '#ORD005', customer: 'Michael Brown', date: '2024-01-13', amount: '$299.99', status: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Dashboard Overview
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`
              rounded-xl p-6 shadow-lg
              ${darkMode ? 'bg-gray-800' : 'bg-white'}
              border ${darkMode ? 'border-gray-700' : 'border-gray-200'}
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {stat.icon}
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className={`flex items-center ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                <span className="ml-1 font-medium">{stat.change}</span>
              </span>
              <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Placeholder */}
        <div className={`
          rounded-xl p-6 shadow-lg
          ${darkMode ? 'bg-gray-800' : 'bg-white'}
          border ${darkMode ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Revenue Overview
            </h3>
            <select className={`
              px-3 py-1 rounded-lg text-sm
              ${darkMode 
                ? 'bg-gray-700 text-white border-gray-600' 
                : 'bg-gray-50 text-gray-800 border-gray-200'
              }
              border focus:outline-none
            `}>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className="text-4xl mb-2">📊</div>
              <p>Chart visualization would appear here</p>
              <p className="text-sm mt-2">(Interactive chart library integration)</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className={`
          rounded-xl p-6 shadow-lg
          ${darkMode ? 'bg-gray-800' : 'bg-white'}
          border ${darkMode ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Recent Orders
            </h3>
            <a
              href="#"
              className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
            >
              View all →
            </a>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left py-3 px-4 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Order ID
                  </th>
                  <th className={`text-left py-3 px-4 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Customer
                  </th>
                  <th className={`text-left py-3 px-4 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Amount
                  </th>
                  <th className={`text-left py-3 px-4 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr 
                    key={order.id}
                    className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <td className="py-3 px-4">
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {order.id}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {order.customer}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {order.amount}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                        ${order.status === 'Processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                        ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                        ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
                      `}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={`
        rounded-xl p-6 shadow-lg
        ${darkMode ? 'bg-gray-800' : 'bg-white'}
        border ${darkMode ? 'border-gray-700' : 'border-gray-200'}
      `}>
        <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Quick Stats
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className={`text-3xl font-bold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              98.2%
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Customer Satisfaction
            </p>
          </div>
          <div className="text-center p-4">
            <div className={`text-3xl font-bold mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              24h
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Average Response Time
            </p>
          </div>
          <div className="text-center p-4">
            <div className={`text-3xl font-bold mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              1.2k
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              New Visitors Today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;