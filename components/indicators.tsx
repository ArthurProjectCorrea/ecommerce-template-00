import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface IndicatorItem {
  label: string;
  value: string | number;
}

interface IndicatorsProps {
  items: IndicatorItem[];
}

export function Indicators({ items }: IndicatorsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item, index) => (
        <Card key={index} className="">
          <CardHeader className="text-muted-foreground text-xl font-medium">
            {item.label}
          </CardHeader>
          <CardContent className="text-3xl font-bold">{item.value}</CardContent>
        </Card>
      ))}
    </div>
  );
}
