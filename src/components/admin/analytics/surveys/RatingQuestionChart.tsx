import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface RatingQuestionChartProps {
  result: {
    questionText: string;
    summary: {
      average: number;
      counts: Record<string, number>;
    };
  };
}

const labels = ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'];

const RatingQuestionChart: React.FC<RatingQuestionChartProps> = ({ result }) => {
  const data = labels.map((label, idx) => ({
    label,
    count: result.summary.counts[(5-idx).toString()] || 0,
  }));

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-foreground">{result.questionText}</h3>
        <span className="text-base font-semibold text-blue-700">Avg: {result.summary.average.toFixed(2)}</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis type="category" dataKey="label" />
          <Tooltip />
          <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 6, 6]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RatingQuestionChart;
