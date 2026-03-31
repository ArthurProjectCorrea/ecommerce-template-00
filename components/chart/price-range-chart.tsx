'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface PriceRangeChartProps {
  data: { range: string; count: number; fill: string }[];
}

const chartConfig = {
  economy: {
    label: 'Econômico',
    color: 'var(--chart-1)',
  },
  midrange: {
    label: 'Intermediário',
    color: 'var(--chart-2)',
  },
  premium: {
    label: 'Premium',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig;

export function PriceRangeChart({ data }: PriceRangeChartProps) {
  // Mapeamento de cores baseado em chaves seguras (sem espaços ou caracteres especiais)
  const chartData = data.map((item) => {
    let key = 'economy';
    if (item.range === 'R$ 100 - 500') key = 'midrange';
    else if (item.range === 'Acima de R$ 500') key = 'premium';

    return {
      ...item,
      fill: `var(--color-${key})`,
    };
  });

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Faixas de Preço</CardTitle>
        <CardDescription>Produtos por categoria de valor</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 30,
              right: 12,
              left: 12,
              bottom: 0,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              opacity={0.3}
            />
            <XAxis
              dataKey="range"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.split(' ')[0]} // "Até", "R$", "Acima"
            />
            <YAxis hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground font-bold"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4 pt-4 text-sm">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <div className="flex items-center gap-2">
            <div className="bg-chart-1 h-3 w-3 rounded-full" />
            <span className="text-muted-foreground text-xs">Econômico</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-chart-2 h-3 w-3 rounded-full" />
            <span className="text-muted-foreground text-xs">Intermediário</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-chart-5 h-3 w-3 rounded-full" />
            <span className="text-muted-foreground text-xs">Premium</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
