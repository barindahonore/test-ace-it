
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/services/api';

interface Achievement {
  id: string;
  finalScore: number;
  submittedAt: string;
  status: 'PENDING' | 'REVIEWED' | 'SCORED';
  competition: {
    isTeamBased: boolean;
    event: {
      title: string;
    };
  };
  team?: {
    name: string;
  };
}

const AchievementsPage = () => {
  const { data: achievements = [], isLoading, error } = useQuery({
    queryKey: ['achievements'],
    queryFn: async (): Promise<Achievement[]> => {
      const response = await api.get('/submissions/me');
      return response.data.data || [];
    }
  });

  // Sort achievements by most recent first
  const sortedAchievements = [...achievements].sort((a, b) => 
    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCORED':
        return <Badge variant="default" className="bg-green-100 text-green-800">Scored</Badge>;
      case 'REVIEWED':
        return <Badge variant="secondary">Reviewed</Badge>;
      case 'PENDING':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (isTeamBased: boolean) => {
    return isTeamBased ? (
      <Users className="w-4 h-4 text-blue-600" />
    ) : (
      <User className="w-4 h-4 text-green-600" />
    );
  };

  const getScoreDisplay = (score: number | null | undefined) => {
    if (score === null || score === undefined) {
      return <span className="text-muted-foreground">-</span>;
    }
    return (
      <div className="flex items-center space-x-1">
        <Trophy className="w-4 h-4 text-yellow-500" />
        <span className="font-semibold">{score}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Achievements</h1>
            <p className="text-muted-foreground">Your competition scores and achievements</p>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Achievements</h1>
            <p className="text-muted-foreground">Your competition scores and achievements</p>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-red-600">
                Failed to load achievements. Please try again.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <span>Achievements</span>
          </h1>
          <p className="text-muted-foreground">
            Your competition scores and achievements from both individual and team competitions
          </p>
        </div>

        {/* Achievements Table */}
        <Card>
          <CardHeader>
            <CardTitle>Competition Results</CardTitle>
            <CardDescription>
              All your submissions and their scores, sorted by most recent first
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sortedAchievements.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No achievements yet</h3>
                <p className="text-muted-foreground">
                  Start participating in competitions to see your scores here
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Competition</TableHead>
                    <TableHead>Team/Individual</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAchievements.map((achievement) => (
                    <TableRow key={achievement.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(achievement.competition.isTeamBased)}
                          <span className="text-sm">
                            {achievement.competition.isTeamBased ? 'Team' : 'Individual'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {achievement.competition.event.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        {achievement.competition.isTeamBased && achievement.team ? (
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span>{achievement.team.name}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4 text-green-600" />
                            <span>Individual Entry</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {getScoreDisplay(achievement.finalScore)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(achievement.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(achievement.submittedAt), 'MMM dd, yyyy')}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AchievementsPage;
