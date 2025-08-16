
import { useState, useEffect } from "react";
import { 
  Calendar, 
  Trophy, 
  Users, 
  Upload,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";

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
          <button onClick={() => fetchDashboardData()} className="bg-primary text-white px-4 py-2 rounded">
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
    </div>
  );
};

export default DashboardPage;
