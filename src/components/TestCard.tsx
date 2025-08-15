
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface TestCardProps {
  title: string;
  description: string;
  status: "idle" | "running" | "passed" | "failed";
  duration?: string;
  lastRun?: string;
}

const TestCard = ({ title, description, status, duration, lastRun }: TestCardProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case "running":
        return <Clock className="w-4 h-4 animate-spin" />;
      case "passed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "running":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Running</Badge>;
      case "passed":
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Passed</Badge>;
      case "failed":
        return <Badge variant="secondary" className="bg-red-100 text-red-700">Failed</Badge>;
      default:
        return <Badge variant="outline">Ready</Badge>;
    }
  };

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-elevated hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1 text-xs text-muted-foreground">
            {duration && <span>Duration: {duration}</span>}
            {lastRun && <span>Last run: {lastRun}</span>}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Play className="w-3 h-3 mr-1" />
            Run
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestCard;
