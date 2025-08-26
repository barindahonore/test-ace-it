import React from 'react';

interface SurveyResponseSummaryProps {
  totalResponses: number;
}

const SurveyResponseSummary: React.FC<SurveyResponseSummaryProps> = ({ totalResponses }) => (
  <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-between">
    <span className="text-lg font-semibold text-blue-700">Total Responses</span>
    <span className="text-2xl font-bold text-blue-900">{totalResponses}</span>
  </div>
);

export default SurveyResponseSummary;
