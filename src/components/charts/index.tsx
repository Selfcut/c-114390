
import React from 'react';

// Simple chart components as placeholders
// In a real application, you would use a library like recharts

interface ChartProps {
  data?: any[];
  height?: number | string;
  width?: number | string;
  title?: string;
  children?: React.ReactNode;
}

export const BarChart = ({ 
  data = [], 
  height = 300, 
  width = '100%', 
  title = 'Bar Chart',
  children
}: ChartProps) => {
  return (
    <div 
      style={{ height, width }} 
      className="flex items-center justify-center bg-muted/30 rounded-md border border-border"
    >
      {children || (
        <div className="text-center">
          <p className="font-medium mb-2">{title}</p>
          <p className="text-sm text-muted-foreground">
            Bar chart placeholder - Replace with recharts component
          </p>
        </div>
      )}
    </div>
  );
};

export const LineChart = ({ 
  data = [], 
  height = 300, 
  width = '100%', 
  title = 'Line Chart',
  children
}: ChartProps) => {
  return (
    <div 
      style={{ height, width }} 
      className="flex items-center justify-center bg-muted/30 rounded-md border border-border"
    >
      {children || (
        <div className="text-center">
          <p className="font-medium mb-2">{title}</p>
          <p className="text-sm text-muted-foreground">
            Line chart placeholder - Replace with recharts component
          </p>
        </div>
      )}
    </div>
  );
};

export const PieChart = ({ 
  data = [], 
  height = 300, 
  width = '100%', 
  title = 'Pie Chart',
  children
}: ChartProps) => {
  return (
    <div 
      style={{ height, width }} 
      className="flex items-center justify-center bg-muted/30 rounded-md border border-border"
    >
      {children || (
        <div className="text-center">
          <p className="font-medium mb-2">{title}</p>
          <p className="text-sm text-muted-foreground">
            Pie chart placeholder - Replace with recharts component
          </p>
        </div>
      )}
    </div>
  );
};
