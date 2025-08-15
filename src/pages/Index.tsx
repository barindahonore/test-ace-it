
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TestCard from "@/components/TestCard";

const Index = () => {
  const testData = [
    {
      title: "API Integration Tests",
      description: "Comprehensive testing of REST API endpoints and data validation",
      status: "passed" as const,
      duration: "2.3s",
      lastRun: "2 minutes ago"
    },
    {
      title: "UI Component Tests",
      description: "Testing React components for functionality and accessibility",
      status: "running" as const,
      duration: "1.8s",
      lastRun: "Running now"
    },
    {
      title: "Performance Tests",
      description: "Load testing and performance benchmarking suite",
      status: "failed" as const,
      duration: "5.2s",
      lastRun: "1 hour ago"
    },
    {
      title: "Security Tests",
      description: "Vulnerability scanning and security validation",
      status: "idle" as const,
      duration: "3.1s",
      lastRun: "Never"
    },
    {
      title: "Database Tests",
      description: "Testing database operations and data integrity",
      status: "passed" as const,
      duration: "4.7s",
      lastRun: "5 minutes ago"
    },
    {
      title: "Integration Tests",
      description: "End-to-end testing across multiple services",
      status: "idle" as const,
      duration: "8.3s",
      lastRun: "1 day ago"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Test Suite Dashboard</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Monitor and manage all your tests from one beautiful interface. 
              Real-time status updates and detailed analytics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testData.map((test, index) => (
              <TestCard key={index} {...test} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
