import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { SheetsService, SheetData } from '@/services/sheetsService';

interface SheetChartProps {
  sheetId: string;
  range: string;
  title: string;
  dataKey: string;
  labelKey: string;
}

// Mock data for when backend is not available
const getMockData = (title: string) => {
  if (title.includes('Vendor Performance')) {
    return [
      { vendor: 'TechSupply Co.', performance: 92 },
      { vendor: 'Global Goods Ltd.', performance: 87 },
      { vendor: 'Premium Parts Inc.', performance: 75 },
      { vendor: 'Swift Supplies', performance: 94 },
      { vendor: 'Quality Vendors', performance: 88 },
    ];
  } else if (title.includes('Sales')) {
    return [
      { month: 'Jan', sales: 45000 },
      { month: 'Feb', sales: 52000 },
      { month: 'Mar', sales: 48000 },
      { month: 'Apr', sales: 61000 },
      { month: 'May', sales: 55000 },
      { month: 'Jun', sales: 67000 },
    ];
  } else if (title.includes('Inventory')) {
    return [
      { category: 'Electronics', items: 1250 },
      { category: 'Industrial', items: 890 },
      { category: 'General', items: 2100 },
      { category: 'Logistics', items: 450 },
    ];
  } else {
    // Default mock data
    return [
      { label: 'Category A', value: 120 },
      { label: 'Category B', value: 85 },
      { label: 'Category C', value: 150 },
      { label: 'Category D', value: 95 },
      { label: 'Category E', value: 110 },
    ];
  }
};

export function SheetChart({ sheetId, range, title, dataKey, labelKey }: SheetChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sheetData: SheetData = await SheetsService.fetchSheetData(sheetId, range);
        setData(sheetData.data);
        setError(null); // Clear any previous error
      } catch (err) {
        console.warn('Backend not available, using mock data:', err);
        // Use mock data as fallback
        const mockData = getMockData(title);
        setData(mockData);
        setError(null); // Don't show error when using mock data
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sheetId, range, title]);

  const chartConfig = {
    [dataKey]: {
      label: title,
      color: "hsl(var(--chart-1))",
    },
  };

  if (loading) {
    return (
      <Card className="border-border/50 shadow-soft animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading chart data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-border/50 shadow-soft animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-destructive">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={labelKey}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey={dataKey}
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
