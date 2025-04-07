import React from 'react';
import { Building, ChartBar, Brain, Database, Wrench, Users } from 'lucide-react';

// Feature data structure
const features = [
  {
    title: 'Property Analysis',
    icon: Building,
    color: '#3b82f6',
    items: [
      'Detailed property evaluation',
      '45 Atlanta submarkets classification',
      'Investment timeline assessment',
      'Traffic analysis & GDOT impact',
    ],
  },
  {
    title: 'Market Intelligence',
    icon: ChartBar,
    color: '#10b981',
    items: [
      'Market cap rate calculations',
      'Vacancy rate analysis',
      'Rent growth trends',
      'Absorption rate evaluation',
    ],
  },
  {
    title: 'AI Capabilities',
    icon: Brain,
    color: '#8b5cf6',
    items: [
      'ReAct agent architecture',
      'Memory persistence',
      'Custom system prompts',
      'Advanced reasoning',
    ],
  },
  {
    title: 'Data Sources',
    icon: Database,
    color: '#f59e0b',
    items: [
      'GDOT transportation data',
      'CoStar market analytics',
      'FRED economic indicators',
      'CREXI property listings',
    ],
  },
  {
    title: 'Tools & Analysis',
    icon: Wrench,
    color: '#ec4899',
    items: [
      'Property inventory search',
      'Market report generation',
      'Economic trend analysis',
      'Investment calculations',
    ],
  },
  {
    title: 'Client Support',
    icon: Users,
    color: '#06b6d4',
    items: [
      'Call script generation',
      'Objection handling',
      'UVP creation',
      'Tenant mix optimization',
    ],
  },
];

export function FeaturesShowcase() {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 relative">
          <span className="inline-block px-4 py-1 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#94a3b8]">
            Comprehensive Analysis Tools
          </h2>
          <p className="text-xl text-[#94a3b8] max-w-2xl mx-auto">
            Leverage our advanced AI capabilities to make data-driven real estate decisions
          </p>
        </div>

        {/* Feature cards in a creative layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-card relative overflow-hidden bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl border border-[#334155] hover:border-[#3b82f6] transition-all duration-300"
              style={{ 
                borderTopWidth: index % 2 === 0 ? '4px' : '1px',
                borderTopColor: feature.color,
                boxShadow: `0 10px 30px -15px ${feature.color}30`
              }}
            >
              {/* Diagonal divider */}
              <div 
                className="absolute top-0 right-0 w-24 h-24" 
                style={{ 
                  background: `linear-gradient(135deg, transparent 50%, ${feature.color}20 50%)`,
                }}
              />
              
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3" style={{ color: feature.color }}>
                      {feature.title}
                    </h3>
                    
                    <ul className="space-y-2 text-[#94a3b8]">
                      {feature.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: feature.color }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Bottom accent */}
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-30" style={{ 
                '--tw-gradient-via': feature.color 
              } as React.CSSProperties} />
            </div>
          ))}
        </div>
      </div>
      
      {/* CSS for 3D cube */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .preserve-3d {
          transform-style: preserve-3d;
          transform: rotateX(-15deg) rotateY(15deg);
        }
        
        .cube-face {
          backface-visibility: hidden;
          transition: transform 0.5s ease;
        }
        
        .cube-face-front {
          transform: translateZ(150px);
        }
        
        .cube-face-back {
          transform: rotateY(180deg) translateZ(150px);
        }
        
        .cube-face-right {
          transform: rotateY(90deg) translateZ(150px);
        }
        
        .cube-face-left {
          transform: rotateY(-90deg) translateZ(150px);
        }
        
        .cube-face-top {
          transform: rotateX(90deg) translateZ(150px);
        }
        
        .cube-face-bottom {
          transform: rotateX(-90deg) translateZ(150px);
        }
        
        .cube-container:hover {
          animation: rotate 15s infinite linear;
        }
        
        @keyframes rotate {
          from {
            transform: rotateX(-15deg) rotateY(0deg);
          }
          to {
            transform: rotateX(-15deg) rotateY(360deg);
          }
        }
      `}</style>
    </section>
  );
} 