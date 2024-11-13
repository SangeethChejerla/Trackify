import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string;
  icon?: React.ReactNode;
  description?: string;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card className={cn('', className)} {...props}>
      <div className="p-6">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="flex items-center text-muted-foreground">
              {icon}
            </div>
          )}
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
