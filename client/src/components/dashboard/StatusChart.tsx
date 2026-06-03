import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { STATUS_CHART_COLORS } from '../../lib/constants';
import type { LeadStatus } from '../../types';

interface StatusChartProps {
  data: Record<LeadStatus, number>;
  onStatusClick?: (status: LeadStatus | '') => void;
  activeStatus?: LeadStatus | '';
}

export default function StatusChart({ data, onStatusClick, activeStatus = '' }: StatusChartProps) {
  const chartData = Object.entries(data)
    .map(([status, count]) => ({
      name: status,
      value: count,
      color: STATUS_CHART_COLORS[status as LeadStatus],
    }))
    .filter((item) => item.value > 0);

  const handleStatusClick = (status: LeadStatus) => {
    if (onStatusClick) {
      if (activeStatus === status) {
        onStatusClick('');
      } else {
        onStatusClick(status);
      }
    }
  };

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-muted">
        No data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white rounded-xl border border-border-light shadow-elevated px-4 py-3">
          <p className="text-sm font-medium text-dark">{data.name}</p>
          <p className="text-sm text-muted">
            {data.value} lead{data.value !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload?.map((entry: any, index: number) => {
        const isSelected = activeStatus === entry.value;
        return (
          <button
            key={index}
            onClick={() => handleStatusClick(entry.value as LeadStatus)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all duration-200 border cursor-pointer ${
              isSelected
                ? 'border-lilac-dark bg-lilac/10 text-lilac-deep font-semibold shadow-sm'
                : 'border-transparent text-muted hover:text-dark hover:bg-surface-2'
            }`}
          >
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs">{entry.value}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl border border-border-light p-6 shadow-soft"
    >
      <h3 className="font-heading text-base font-semibold text-dark mb-4">
        Lead Distribution
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
            onClick={(data) => {
              if (data && data.name) {
                handleStatusClick(data.name as LeadStatus);
              }
            }}
            style={{ cursor: onStatusClick ? 'pointer' : 'default' }}
          >
            {chartData.map((entry, index) => {
              const isSelected = activeStatus === entry.name;
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={activeStatus === '' || isSelected ? 1 : 0.4}
                  style={{
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                    transformOrigin: '50% 45%',
                    transition: 'all 0.3s ease',
                  }}
                />
              );
            })}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
