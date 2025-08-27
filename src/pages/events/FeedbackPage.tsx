import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StarRatingInput from '@/components/events/StarRatingInput';
import { api } from '@/services/api';

interface SurveyQuestion {
  id: string;
  text: string;
  type: string;
}

const FeedbackPage: React.FC = () => {
  const { id: eventId } = useParams();
  const [eventTitle, setEventTitle] = useState('');
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const eventRes = await api.get(`/events/${eventId}`);
        setEventTitle(eventRes.data.data.title);
        const questionsRes = await api.get('/surveys/standard');
        setQuestions(questionsRes.data.data);
      } catch (err: any) {
        setError('Failed to load event or survey questions.');
      } finally {
        setIsLoading(false);
      }
    };
    if (eventId) fetchData();
  }, [eventId]);

  const handleChange = (qid: string, value: string) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  const allAnswered = questions.every(q => answers[q.id]?.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await api.post(`/surveys/events/${eventId}/responses`, { answers });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-destructive">{error}</div>;
  if (submitted) return (
    <div className="max-w-xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-700">Thank You!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">Your feedback has been submitted successfully.</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Event Feedback: {eventTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {questions.map(q => (
              <div key={q.id} className="space-y-2">
                <label className="block font-medium text-base mb-1">{q.text}</label>
                {q.type === 'RATING_1_5' ? (
                  <StarRatingInput value={answers[q.id] || ''} onChange={val => handleChange(q.id, val)} />
                ) : q.type === 'SHORT_TEXT' ? (
                  <input type="text" className="w-full border rounded px-3 py-2" value={answers[q.id] || ''} onChange={e => handleChange(q.id, e.target.value)} required />
                ) : q.type === 'LONG_TEXT' ? (
                  <textarea className="w-full border rounded px-3 py-2" value={answers[q.id] || ''} onChange={e => handleChange(q.id, e.target.value)} required rows={4} />
                ) : null}
              </div>
            ))}
            <Button type="submit" disabled={!allAnswered || isSubmitting} className="w-full mt-4">
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
            {error && <div className="text-destructive text-sm mt-2">{error}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackPage;
