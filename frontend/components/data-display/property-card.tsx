import React from 'react';
import { Building2, MapPin, TrendingUp, DollarSign, Percent, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PropertyMetric {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

interface PropertyCardProps {
  property: {
    name: string;
    address: string;
    type: string;
    image?: string;
    capRate?: number;
    noi?: number;
    price?: number;
    year?: number;
    sqft?: number;
    metrics?: PropertyMetric[];
  };
  className?: string;
}

function PropertyMetricItem({ label, value, icon, trend, className }: PropertyMetric) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="text-sm text-muted-foreground flex items-center gap-1">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-1 font-medium">
        <span>{value}</span>
        {trend && (
          <span className={cn(
            "text-xs",
            trend === 'up' ? "text-green-500" : 
            trend === 'down' ? "text-red-500" : 
            "text-muted-foreground"
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
    </div>
  );
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const defaultMetrics: PropertyMetric[] = [];
  
  if (property.capRate !== undefined) {
    defaultMetrics.push({
      label: 'Cap Rate',
      value: `${property.capRate.toFixed(2)}%`,
      icon: <Percent className="h-3 w-3" />,
    });
  }
  
  if (property.noi !== undefined) {
    defaultMetrics.push({
      label: 'NOI',
      value: `$${property.noi.toLocaleString()}`,
      icon: <TrendingUp className="h-3 w-3" />,
    });
  }
  
  if (property.price !== undefined) {
    defaultMetrics.push({
      label: 'Price',
      value: `$${property.price.toLocaleString()}`,
      icon: <DollarSign className="h-3 w-3" />,
    });
  }
  
  if (property.year !== undefined) {
    defaultMetrics.push({
      label: 'Year Built',
      value: property.year,
      icon: <Calendar className="h-3 w-3" />,
    });
  }
  
  const metrics = property.metrics || defaultMetrics;
  
  return (
    <Card className={cn("property-card overflow-hidden", className)}>
      {property.image && (
        <div className="relative h-48 w-full">
          <img 
            src={property.image} 
            alt={property.name} 
            className="object-cover w-full h-full"
          />
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-medium py-1 px-2 rounded">
            {property.type}
          </div>
        </div>
      )}
      
      <CardHeader className={property.image ? "pt-4" : ""}>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              {property.name}
            </CardTitle>
            <CardDescription className="flex items-center mt-1 gap-1">
              <MapPin className="h-3 w-3" />
              {property.address}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {metrics.map((metric, i) => (
            <PropertyMetricItem key={i} {...metric} />
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </div>
        <div className="text-xs font-medium text-primary">
          View Details
        </div>
      </CardFooter>
    </Card>
  );
} 