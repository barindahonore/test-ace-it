
import { useState, useEffect } from "react";
import { 
  Calendar, 
  BookOpen, 
  Trophy, 
  Clock, 
  Users, 
  ChevronRight,
  Star,
  Upload,
  Search,
  BarChart3,
  Award,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Registration {
  id: string;
  userId: string;
  eventId: string;
  status: string;
  registeredAt: string;
  event: {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    location?: string;
    status: string;
    competition: {
      eventId: string;
      isTeamBased: boolean;
    } | null;
  };
}

interface UserSubmission {
  id: string;
  content: {
    url: string;
    description: string;
  };
  submittedAt: string;
  competition: {
    id: string;
    eventId: string;
  };
}

const DashboardPage = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [mySubmissions, setMySubmissions] = useState<UserSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch registrations and submissions in parallel
      const [registrationsResponse, submissionsResponse] = await Promise.all([
        api.get('/registrations/me'),
        api.get('/submissions/me')
      ]);
      
      console.log('Registrations response:', registrationsResponse.data);
      console.log('Submissions response:', submissionsResponse.data);
      
      if (registrationsResponse.data.success) {
        setRegistrations(registrationsResponse.data.data || []);
      } else {
        throw new Error(registrationsResponse.data.message || 'Failed to fetch registrations');
      }

      if (submissionsResponse.data.success) {
        setMySubmissions(submissionsResponse.data.data || []);
      }
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load dashboard data';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [toast]);

  // Filter registrations by type
  const upcomingEvents = registrations.filter(reg => 
    reg.event.status === 'PUBLISHED' && new Date(reg.event.startTime) > new Date()
  );
  
  const individualCompetitions = registrations.filter(reg => 
    reg.event.competition && 
    !reg.event.competition.isTeamBased &&
    reg.event.status === 'PUBLISHED'
  );

  const teamCompetitions = registrations.filter(reg => 
    reg.event.competition && 
    reg.event.competition.isTeamBased &&
    reg.event.status === 'PUBLISHED'
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => fetchDashboardData()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Registrations</p>
                <p className="text-2xl font-bold text-foreground">{registrations.length}</p>
                <p className="text-xs text-primary font-medium">events registered</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-900/10 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Competitions</p>
                <p className="text-2xl font-bold text-foreground">{teamCompetitions.length}</p>
                <p className="text-xs text-green-600 font-medium">team events</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900/30">
                <Users className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-900/20 dark:to-amber-900/10 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Individual Competitions</p>
                <p className="text-2xl font-bold text-foreground">{individualCompetitions.length}</p>
                <p className="text-xs text-amber-600 font-medium">solo challenges</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center dark:bg-amber-900/30">
                <Upload className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-900/10 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Submissions</p>
                <p className="text-2xl font-bold text-foreground">{mySubmissions.length}</p>
                <p className="text-xs text-purple-600 font-medium">works submitted</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center dark:bg-purple-900/30">
                <Trophy className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Recent Registrations
            </CardTitle>
            <CardDescription>Your latest event registrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {registrations.length > 0 ? (
              registrations.slice(0, 5).map((registration) => {
                const event = registration.event;
                
                return (
                  <div key={registration.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(event.startTime)} • {event.location}
                        </p>
                        {event.competition && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {event.competition.isTeamBased ? 'Team Competition' : 'Individual Competition'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No registrations found. Explore and register for events!
              </p>
            )}
            <Button variant="ghost" className="w-full mt-3" onClick={() => navigate('/student/events')}>
              View All Events
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Upload className="w-5 h-5 mr-2 text-primary" />
              Submission Status
            </CardTitle>
            <CardDescription>Track your competition submissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {individualCompetitions.length > 0 ? (
              <div className="space-y-3">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <p className="text-lg font-semibold text-primary">{individualCompetitions.length}</p>
                  <p className="text-sm text-muted-foreground">Individual Competitions</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-lg font-semibold text-green-600">{mySubmissions.length}</p>
                  <p className="text-sm text-muted-foreground">Submissions Made</p>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/student/submissions')}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Manage Submissions
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No individual competitions registered.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Frequently used features and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => navigate('/student/events')}
            >
              <Search className="w-6 h-6" />
              <span>Browse Events</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => navigate('/student/submissions')}
            >
              <Upload className="w-6 h-6" />
              <span>My Submissions</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => navigate('/student/teams')}
            >
              <Users className="w-6 h-6" />
              <span>My Teams</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Award className="w-6 h-6" />
              <span>Achievements</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
