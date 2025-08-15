
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, TrendingUp } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-16 px-6">
      <div className="absolute inset-0 gradient-secondary opacity-50" />
      
      <div className="container mx-auto relative">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 animate-pulse-slow">
            ✨ Testing Made Beautiful
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent gradient-primary">
            Test Everything
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            The most elegant way to test your applications. Beautiful interface, 
            powerful features, seamless experience.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="gradient-primary border-0 shadow-glow">
              <Zap className="w-4 h-4 mr-2" />
              Start Testing
            </Button>
            <Button variant="outline" size="lg">
              View Documentation
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center group">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl gradient-primary flex items-center justify-center group-hover:animate-float">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Precise Testing</h3>
              <p className="text-sm text-muted-foreground">Pinpoint accuracy in every test scenario</p>
            </div>
            
            <div className="text-center group">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl gradient-primary flex items-center justify-center group-hover:animate-float" style={{animationDelay: '2s'}}>
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">Run tests at incredible speeds</p>
            </div>
            
            <div className="text-center group">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl gradient-primary flex items-center justify-center group-hover:animate-float" style={{animationDelay: '4s'}}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Smart Analytics</h3>
              <p className="text-sm text-muted-foreground">Insights that drive better results</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
