import Link from "next/link";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";

export const CTA = () => {
  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden">
      {/* Background elements similar to FeaturesShowcase */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header styled like FeaturesShowcase */}
        <div className="text-center mb-16 relative">
          <span className="inline-block px-4 py-1 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#94a3b8]">
            Transform Your Analysis Process
          </h2>
          <p className="text-xl text-[#94a3b8] max-w-2xl mx-auto">
            Join the future of commercial real estate analysis with our AI-powered platform
          </p>
        </div>

        {/* CTA Card with enhanced styling */}
        <div 
          className="relative overflow-hidden bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl border border-[#334155] hover:border-[#3b82f6] transition-all duration-300 shadow-[0_10px_30px_-15px_rgba(59,130,246,0.3)]"
          style={{ 
            borderTopWidth: '4px',
            borderTopColor: '#3b82f6',
          }}
        >
          {/* Diagonal divider like in feature cards */}
          <div 
            className="absolute top-0 right-0 w-32 h-32" 
            style={{ 
              background: 'linear-gradient(135deg, transparent 50%, rgba(59,130,246,0.1) 50%)',
            }}
          />
          
          {/* Background elements */}
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#3b82f6] rounded-full mix-blend-multiply filter blur-[128px] opacity-20" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10" />
          
          {/* Content */}
          <div className="relative p-8 sm:p-16 z-10">
            <div className="flex flex-col items-center text-center">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: 'rgba(59,130,246,0.1)' }}
              >
                <Sparkles className="h-8 w-8 text-[#3b82f6]" />
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
                Ready to Transform Your Analysis?
              </h3>
              
              <p className="text-xl text-[#94a3b8] mb-10 max-w-2xl">
                Our AI-powered platform provides comprehensive property analysis, market insights, and data-driven recommendations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Link 
                  href="/chat"
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium rounded-full bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-all duration-300 hover:gap-3 overflow-hidden"
                >
                  <span className="relative z-10">Start Analyzing Now</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                
                <a 
                  href="#features"
                  className="group inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full border border-[#334155] hover:border-[#3b82f6] hover:bg-[#1e293b]/50 transition-colors duration-300"
                >
                  <span className="mr-2 group-hover:text-[#3b82f6] transition-colors duration-300">Learn More</span>
                  <div className="w-5 h-5 rounded-full border border-[#334155] group-hover:border-[#3b82f6] flex items-center justify-center transition-colors duration-300">
                    <ChevronRight className="w-3 h-3 text-[#94a3b8] group-hover:text-[#3b82f6] transition-colors duration-300" />
                  </div>
                </a>
              </div>
            </div>
          </div>
          
          {/* Bottom accent like in feature cards */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-30" />
        </div>
      </div>
      
      {/* CSS for animation effects */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
}

export const EconomicIndicators = () => {
  // Economic indicator data
  const indicators = [
    { name: "Federal Funds Rate", icon: "📊" },
    { name: "Treasury Yields", icon: "📈" },
    { name: "Construction Spending", icon: "🏗️" },
    { name: "Commercial Space Leasing", icon: "🏢" },
    { name: "Price Index: Retail", icon: "🛒" },
    { name: "GDP Growth", icon: "📉" },
    { name: "Inflation Metrics", icon: "💹" },
    { name: "Market Health Metrics", icon: "🔍" }
  ];

  return (
    <section id="economic-indicators" className="relative py-24 overflow-hidden border-t border-[#334155]">
      {/* Background elements similar to FeaturesShowcase */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header styled like FeaturesShowcase */}
        <div className="text-center mb-16 relative">
          <span className="inline-block px-4 py-1 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] text-sm font-medium mb-4">
            Data Sources
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#94a3b8]">
            Supported Economic Indicators
          </h2>
          <p className="text-xl text-[#94a3b8] max-w-2xl mx-auto">
            Access real-time economic data to make informed investment decisions
          </p>
        </div>

        {/* Indicators grid with enhanced styling */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          {indicators.map((indicator, i) => (
            <div 
              key={i}
              className="group relative overflow-hidden bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-6 rounded-xl border border-[#334155] hover:border-[#f59e0b] transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:-translate-y-1"
              style={{ 
                borderTopWidth: i % 3 === 0 ? '4px' : '1px',
                borderTopColor: '#f59e0b',
              }}
            >
              {/* Diagonal divider */}
              <div 
                className="absolute top-0 right-0 w-24 h-24" 
                style={{ 
                  background: 'linear-gradient(135deg, transparent 50%, rgba(245,158,11,0.1) 50%)',
                }}
              />
              
              <div className="relative flex flex-col items-center text-center gap-3 z-10">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-2"
                  style={{ backgroundColor: 'rgba(245,158,11,0.1)' }}
                >
                  <span className="text-2xl">{indicator.icon}</span>
                </div>
                <div className="text-[#94a3b8] group-hover:text-white transition-colors duration-300 font-medium">
                  {indicator.name}
                </div>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#f59e0b]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              
              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent opacity-30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}