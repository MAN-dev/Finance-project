import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Transaction, TransactionType } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface AnalyticsProps {
  transactions: Transaction[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  // Process data for Monthly Trend
  const today = new Date();
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    return {
      name: d.toLocaleString('default', { month: 'short' }),
      month: d.getMonth(),
      year: d.getFullYear(),
      Income: 0,
      Expense: 0,
    };
  }).reverse();

  transactions.forEach(t => {
    const tDate = new Date(t.date);
    const monthData = last6Months.find(m => m.month === tDate.getMonth() && m.year === tDate.getFullYear());
    if (monthData) {
      if (t.type === TransactionType.CREDIT) monthData.Income += t.amount;
      else monthData.Expense += t.amount;
    }
  });

  // Process data for Category Breakdown (Expenses only)
  const expenseTransactions = transactions.filter(t => t.type === TransactionType.DEBIT);
  const categoryDataMap: Record<string, number> = {};
  
  expenseTransactions.forEach(t => {
    categoryDataMap[t.category] = (categoryDataMap[t.category] || 0) + t.amount;
  });

  const categoryData = Object.keys(categoryDataMap)
    .map(name => ({ name, value: categoryDataMap[name] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 categories

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#18181b] border border-zinc-700 p-3 rounded-lg shadow-lg">
          <p className="text-zinc-300 mb-1 text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
             <p key={index} style={{ color: entry.color }} className="text-sm">
                {entry.name}: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(entry.value)}
             </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Trend */}
      <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Cash Flow</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last6Months}>
              <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
              <Tooltip cursor={{fill: '#27272a', opacity: 0.4}} content={<CustomTooltip />} />
              <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
              <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Top Expenses</h3>
        <div className="h-[250px] w-full relative">
           {categoryData.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#6b7280'} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                     verticalAlign="middle" 
                     align="right" 
                     layout="vertical" 
                     iconType="circle"
                     formatter={(value) => <span className="text-zinc-400 text-sm ml-1">{value}</span>}
                  />
                </PieChart>
             </ResponsiveContainer>
           ) : (
             <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
                No expense data available
             </div>
           )}
        </div>
      </div>
    </div>
  );
};