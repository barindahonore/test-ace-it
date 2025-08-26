import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Download, Users, Calendar, FileText } from 'lucide-react';
import { api } from '@/services/api';

const downloadFile = async (url: string, params: Record<string, string | undefined>) => {
  const query = Object.entries(params)
    .filter(([_, v]) => v)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
    .join('&');
  const fullUrl = query ? `${url}?${query}` : url;
  const response = await api.get(fullUrl, { responseType: 'blob' });
  const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fullUrl.split('/').pop() + '.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const USER_ROLES = ["STUDENT", "JUDGE", "ADMIN"];
const USER_STATUSES = ["ACTIVE", "SUSPENDED", "PENDING"];
const EVENT_STATUSES = ["DRAFT", "PUBLISHED", "CANCELLED", "IN_PROGRESS", "COMPLETED"];

const ReportsPage: React.FC = () => {
  // User Report Filters
  const [userRole, setUserRole] = useState('');
  const [userStatus, setUserStatus] = useState('');
  const [userCreatedAfter, setUserCreatedAfter] = useState('');

  // Events Report Filters
  const [eventStatus, setEventStatus] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');

  // Detailed Event Report
  const [detailedEventId, setDetailedEventId] = useState('');
  const [events, setEvents] = useState<{ id: string; title: string }[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const res = await api.get('/events?limit=100');
        setEvents(res.data.data.map((e: any) => ({ id: e.id, title: e.title })));
      } catch {
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="p-6 space-y-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
        <FileText className="w-7 h-7 text-primary" /> Reports
      </h1>
      <Separator />
      {/* Users Report */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-blue-600" /> All Users Report</CardTitle>
          <CardDescription>Download user data filtered by role, status, and creation date.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="userRole">Role</Label>
              <select id="userRole" value={userRole} onChange={e => setUserRole(e.target.value)} className="w-full h-10 rounded border px-2">
                <option value="">All</option>
                {USER_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="userStatus">Status</Label>
              <select id="userStatus" value={userStatus} onChange={e => setUserStatus(e.target.value)} className="w-full h-10 rounded border px-2">
                <option value="">All</option>
                {USER_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="userCreatedAfter">Created After</Label>
              <Input id="userCreatedAfter" type="date" value={userCreatedAfter} onChange={e => setUserCreatedAfter(e.target.value)} />
            </div>
          </form>
          <Button variant="default" className="w-full" onClick={() => downloadFile('/reports/users', { role: userRole, status: userStatus, createdAfter: userCreatedAfter })}>
            <Download className="w-4 h-4 mr-2" /> Download Users Report
          </Button>
        </CardContent>
      </Card>
      {/* Events Report */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-green-600" /> All Events Report</CardTitle>
          <CardDescription>Download event data filtered by status, organizer, and date range.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="eventStatus">Status</Label>
              <select id="eventStatus" value={eventStatus} onChange={e => setEventStatus(e.target.value)} className="w-full h-10 rounded border px-2">
                <option value="">All</option>
                {EVENT_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="eventStartDate">Start Date</Label>
              <Input id="eventStartDate" type="date" value={eventStartDate} onChange={e => setEventStartDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="eventEndDate">End Date</Label>
              <Input id="eventEndDate" type="date" value={eventEndDate} onChange={e => setEventEndDate(e.target.value)} />
            </div>
          </form>
          <Button variant="default" className="w-full" onClick={() => downloadFile('/reports/events', { status: eventStatus, startDate: eventStartDate, endDate: eventEndDate })}>
            <Download className="w-4 h-4 mr-2" /> Download Events Report
          </Button>
        </CardContent>
      </Card>
      {/* Detailed Event Report */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-purple-600" /> Detailed Event Report</CardTitle>
          <CardDescription>Download a multi-sheet report for a specific event.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="detailedEventId">Select Event</Label>
              <select id="detailedEventId" value={detailedEventId} onChange={e => setDetailedEventId(e.target.value)} className="w-full h-10 rounded border px-2">
                <option value="">Select an event</option>
                {loadingEvents ? (
                  <option disabled>Loading events...</option>
                ) : (
                  events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)
                )}
              </select>
            </div>
          </form>
          <Button variant="default" className="w-full" disabled={!detailedEventId} onClick={() => downloadFile(`/reports/events/${detailedEventId}`, {})}>
            <Download className="w-4 h-4 mr-2" /> Download Detailed Event Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
