'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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

interface InventoryGrowthChartProps {
  data: { date: string; count: number }[];
}

const chartConfig = {
  count: {
    label: 'Novos Produtos',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function InventoryGrowthChart({ data }: InventoryGrowthChartProps) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Crescimento de Inventário</CardTitle>
        <CardDescription>
          Produtos adicionados nos últimos 30 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.split('/')[0]}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="count"
              type="natural"
              fill="var(--color-count)"
              fillOpacity={0.4}
              stroke="var(--color-count)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Expansão do catálogo ativa
        </div>
        <div className="text-muted-foreground leading-none">
          Visualização granular das criações de produtos.
        </div>
      </CardFooter>
    </Card>
  );
}
