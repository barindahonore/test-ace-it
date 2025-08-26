import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import SurveyResponseSummary from '@/components/admin/analytics/surveys/SurveyResponseSummary';
import RatingQuestionChart from '@/components/admin/analytics/surveys/RatingQuestionChart';
import TextQuestionList from '@/components/admin/analytics/surveys/TextQuestionList';
import { api } from '@/services/api';

interface SurveyResults {
  totalResponses: number;
  resultsByQuestion: Array<{
    questionId: string;
    questionText: string;
    questionType: string;
    summary: any;
  }>;
}

const SurveyResultsPage: React.FC = () => {
  const { id: eventId } = useParams();
  const [eventTitle, setEventTitle] = useState('');
  const [surveyResults, setSurveyResults] = useState<SurveyResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const eventRes = await api.get(`/events/${eventId}`);
        setEventTitle(eventRes.data.data.title);
        const surveyRes = await api.get(`/analytics/events/${eventId}/survey-results`);
        setSurveyResults(surveyRes.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load survey results');
      } finally {
        setIsLoading(false);
      }
    };
    if (eventId) fetchData();
  }, [eventId]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Survey Results for: <span className="text-primary">{eventTitle}</span></h1>
      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : error ? (
        <div className="text-center py-12 text-destructive">{error}</div>
      ) : surveyResults ? (
        <>
          <SurveyResponseSummary totalResponses={surveyResults.totalResponses} />
          {surveyResults.resultsByQuestion.map((result) => {
            switch (result.questionType) {
              case 'RATING_1_5':
                return <RatingQuestionChart key={result.questionId} result={result} />;
              case 'SHORT_TEXT':
              case 'LONG_TEXT':
                return <TextQuestionList key={result.questionId} result={result} />;
              default:
                return null;
            }
          })}
        </>
      ) : null}
    </div>
  );
};

export default SurveyResultsPage;
