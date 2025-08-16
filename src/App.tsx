
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from "@/components/ui/sonner"

// Layouts
import Header from '@/components/Header';
import AdminLayout from '@/components/layouts/AdminLayout';
import StudentLayout from '@/components/layouts/StudentLayout';
import JudgeLayout from '@/components/layouts/JudgeLayout';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';

// Admin Pages
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import EventManagementPage from '@/pages/admin/EventManagementPage';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import CompetitionManagementPage from '@/pages/admin/CompetitionManagementPage';

// Student Pages
import StudentDashboardPage from '@/pages/student/DashboardPage';
import StudentEventsPage from '@/pages/student/EventsPage';
import StudentEventDetailPage from '@/pages/student/EventDetailPage';
import MyTeamsPage from '@/pages/student/MyTeamsPage';
import MySubmissionsPage from '@/pages/student/MySubmissionsPage';
import AchievementsPage from '@/pages/student/AchievementsPage';
import ProfilePage from '@/pages/student/ProfilePage';

// Judge Pages
import JudgeDashboardPage from '@/pages/judge/DashboardPage';
import JudgeEventsPage from '@/pages/judge/EventsPage';
import EvaluationPage from '@/pages/judge/EvaluationPage';

// Events Pages
import EventsListPage from '@/pages/events/EventsListPage';
import EventDetailPage from '@/pages/events/EventDetailPage';
import LeaderboardPage from '@/pages/competitions/LeaderboardPage';

import ProtectedRoute from '@/components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <>
                  <Header />
                  <Index />
                </>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Public Events Routes */}
              <Route path="/events" element={
                <>
                  <Header />
                  <EventsListPage />
                </>
              } />
              <Route path="/events/:id" element={
                <>
                  <Header />
                  <EventDetailPage />
                </>
              } />
              <Route path="/competitions/:competitionId/leaderboard" element={
                <>
                  <Header />
                  <LeaderboardPage />
                </>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="events" element={<EventManagementPage />} />
                <Route path="events/:eventId/competition" element={<CompetitionManagementPage />} />
                <Route path="users" element={<UserManagementPage />} />
              </Route>

              {/* Student Routes */}
              <Route path="/student" element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/student/dashboard" replace />} />
                <Route path="dashboard" element={<StudentDashboardPage />} />
                <Route path="events" element={<StudentEventsPage />} />
                <Route path="events/:id" element={<StudentEventDetailPage />} />
                <Route path="teams" element={<MyTeamsPage />} />
                <Route path="submissions" element={<MySubmissionsPage />} />
                <Route path="achievements" element={<AchievementsPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Judge Routes */}
              <Route path="/judge" element={
                <ProtectedRoute allowedRoles={['JUDGE']}>
                  <JudgeLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/judge/dashboard" replace />} />
                <Route path="dashboard" element={<JudgeDashboardPage />} />
                <Route path="events" element={<JudgeEventsPage />} />
                <Route path="evaluate/:submissionId" element={<EvaluationPage />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
