import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Calendar, Award, BarChart3, TrendingUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Loader2 } from 'lucide-react';
import { api } from '@/services/api';

interface KPIs {
  totalActiveUsers: number;
  eventsInProgress: number;
  upcomingEvents: number;
  totalRegistrations: number;
  totalSubmissions: number;
}

interface UserGrowth {
  month: string;
  count: number;
}

interface EventEngagement {
  eventId: string;
  title: string;
  registrationCount: number;
  submissionCount: number;
}

const AnalyticsPage: React.FC = () => {
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [userGrowth, setUserGrowth] = useState<UserGrowth[]>([]);
  const [eventEngagement, setEventEngagement] = useState<EventEngagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const [kpiRes, growthRes, engagementRes] = await Promise.all([
          api.get('/analytics/admin/kpis'),
          api.get('/analytics/admin/user-growth'),
          api.get('/analytics/admin/event-engagement'),
        ]);
        setKpis(kpiRes.data.data);
        setUserGrowth(growthRes.data.data);
        setEventEngagement(engagementRes.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
        <span className="text-muted-foreground text-base">Monitor platform performance and engagement</span>
      </div>
      <Separator />
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center text-destructive text-lg font-semibold py-8">{error}</div>
      ) : (
        <>
          {/* KPIs - mimic dashboard style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-900/10 dark:border-blue-800">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-foreground">{typeof kpis?.totalActiveUsers === 'number' ? kpis.totalActiveUsers : '-'}</p>
                  <p className="text-xs text-blue-600 font-medium flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Growth
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center dark:bg-blue-900/30">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-900/10 dark:border-green-800">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Events In Progress</p>
                  <p className="text-2xl font-bold text-foreground">{typeof kpis?.eventsInProgress === 'number' ? kpis.eventsInProgress : '-'}</p>
                  <p className="text-xs text-green-600 font-medium flex items-center">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Ongoing
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900/30">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 dark:from-yellow-900/20 dark:to-yellow-900/10 dark:border-yellow-800">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming Events</p>
                  <p className="text-2xl font-bold text-foreground">{typeof kpis?.upcomingEvents === 'number' ? kpis.upcomingEvents : '-'}</p>
                  <p className="text-xs text-yellow-600 font-medium flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Soon
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center dark:bg-yellow-900/30">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-900/10 dark:border-purple-800">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Registrations</p>
                  <p className="text-2xl font-bold text-foreground">{typeof kpis?.totalRegistrations === 'number' ? kpis.totalRegistrations : '-'}</p>
                  <p className="text-xs text-purple-600 font-medium flex items-center">
                    <Award className="w-3 h-3 mr-1" />
                    Sign-ups
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center dark:bg-purple-900/30">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 dark:from-pink-900/20 dark:to-pink-900/10 dark:border-pink-800">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submissions</p>
                  <p className="text-2xl font-bold text-foreground">{typeof kpis?.totalSubmissions === 'number' ? kpis.totalSubmissions : '-'}</p>
                  <p className="text-xs text-pink-600 font-medium flex items-center">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Entries
                  </p>
                </div>
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center dark:bg-pink-900/30">
                  <Award className="w-5 h-5 text-pink-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Growth Chart - dashboard style */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-900/10 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-blue-700">User Growth Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={Array.isArray(userGrowth) ? userGrowth.map(u => ({ month: u.month, count: u.count })) : []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{fontSize: 14}} />
                  <YAxis tick={{fontSize: 14}} />
                  <Tooltip wrapperClassName="!text-sm !font-medium" />
                  <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Engaging Events - Line chart style */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-900/10 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-green-700">Top Engaging Events</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={Array.isArray(eventEngagement) ? eventEngagement.map(e => ({ title: e.title, registrations: e.registrationCount, submissions: e.submissionCount })) : []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" tick={{fontSize: 14}} />
                  <YAxis tick={{fontSize: 14}} />
                  <Tooltip wrapperClassName="!text-sm !font-medium" />
                  <Line type="monotone" dataKey="registrations" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Registrations" />
                  <Line type="monotone" dataKey="submissions" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Submissions" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
