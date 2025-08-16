
import { useState, useEffect } from "react";
import { 
  Upload, 
  CheckCircle, 
  Clock, 
  Calendar,
  MapPin,
  Trophy,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { SubmissionModal } from "@/components/submissions/SubmissionModal";

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
      judgingCriteria: Array<{
        name: string;
        maxScore: number;
      }>;
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
  finalScore?: number;
}

const MySubmissionsPage = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [mySubmissions, setMySubmissions] = useState<UserSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch user registrations and submissions in parallel
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
      console.error('Data fetch error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load data';
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
    fetchData();
  }, [toast]);

  const handleSubmissionSuccess = () => {
    // Refresh data after successful submission
    fetchData();
    toast({
      title: "Success!",
      description: "Your submission has been recorded successfully.",
    });
  };

  const handleMakeSubmission = (competitionId: string) => {
    console.log('Opening submission modal for competition:', competitionId);
    setSelectedCompetitionId(competitionId);
    setSubmissionModalOpen(true);
  };

  // Check if user has already submitted for a specific competition
  const hasSubmittedForCompetition = (eventId: string) => {
    const hasSubmission = mySubmissions.some(submission => 
      submission.competition.eventId === eventId
    );
    console.log(`Checking submission for event ${eventId}:`, hasSubmission);
    return hasSubmission;
  };

  const getSubmissionForCompetition = (eventId: string) => {
    return mySubmissions.find(submission => 
      submission.competition.eventId === eventId
    );
  };

  // Filter for individual competitions only
  const individualCompetitions = registrations.filter(registration => 
    registration.event.competition && 
    !registration.event.competition.isTeamBased &&
    registration.event.status === 'PUBLISHED'
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isEventActive = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    return now >= start && now <= end;
  };

  const isEventUpcoming = (startTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    return now < start;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchData}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">My Submissions</h1>
          <p className="text-muted-foreground mt-2">
            Submit your work for individual competitions and track your progress.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Individual Competitions</p>
                  <p className="text-2xl font-bold">{individualCompetitions.length}</p>
                </div>
                <Trophy className="h-8 w-8 text-primary opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submissions Made</p>
                  <p className="text-2xl font-bold">{mySubmissions.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600 opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Submissions</p>
                  <p className="text-2xl font-bold">
                    {individualCompetitions.length - mySubmissions.length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-amber-600 opacity-75" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Competitions List */}
        <Card>
          <CardHeader>
            <CardTitle>Individual Competitions</CardTitle>
            <CardDescription>
              Competitions where you can submit your individual work
            </CardDescription>
          </CardHeader>
          <CardContent>
            {individualCompetitions.length > 0 ? (
              <div className="space-y-4">
                {individualCompetitions.map((registration) => {
                  const event = registration.event;
                  const competition = event.competition!;
                  const hasSubmitted = hasSubmittedForCompetition(event.id);
                  const submission = getSubmissionForCompetition(event.id);
                  const isActive = isEventActive(event.startTime, event.endTime);
                  const isUpcoming = isEventUpcoming(event.startTime);

                  return (
                    <div 
                      key={registration.id} 
                      className="border rounded-lg p-6 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{event.title}</h3>
                            {isActive && (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                Live
                              </Badge>
                            )}
                            {isUpcoming && (
                              <Badge variant="secondary">
                                Upcoming
                              </Badge>
                            )}
                          </div>
                          
                          {event.description && (
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                              {event.description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(event.startTime)}
                            </div>
                            {event.location && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {event.location}
                              </div>
                            )}
                          </div>

                          {competition.judgingCriteria && competition.judgingCriteria.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-1">Judging Criteria:</p>
                              <div className="flex flex-wrap gap-2">
                                {competition.judgingCriteria.map((criterion, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {criterion.name} ({criterion.maxScore} pts)
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {hasSubmitted && submission && (
                            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-green-800">
                                  Submitted on {formatDate(submission.submittedAt)}
                                </span>
                              </div>
                              <p className="text-sm text-green-700">
                                <strong>URL:</strong> <a href={submission.content.url} target="_blank" rel="noopener noreferrer" className="underline">{submission.content.url}</a>
                              </p>
                              {submission.finalScore && (
                                <p className="text-sm text-green-700">
                                  <strong>Score:</strong> {submission.finalScore}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="ml-4">
                          {hasSubmitted ? (
                            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Submitted
                            </Badge>
                          ) : (
                            <Button 
                              onClick={() => handleMakeSubmission(event.id)}
                              className="bg-primary hover:bg-primary/90"
                              disabled={!isActive && !isUpcoming}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Submit Work
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Individual Competitions</h3>
                <p className="text-muted-foreground">
                  You haven't registered for any individual competitions yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Submission Modal */}
      <SubmissionModal
        competitionId={selectedCompetitionId || undefined}
        isOpen={submissionModalOpen}
        onClose={() => {
          setSubmissionModalOpen(false);
          setSelectedCompetitionId(null);
        }}
        onSuccess={handleSubmissionSuccess}
      />
    </div>
  );
};

export default MySubmissionsPage;
