import { Card, CardContent } from './Card';
import { cn } from '@/lib/utils';

export default function StatCard({ title, value, change, icon, trend = 'up', className }) {
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  const trendIcon = trend === 'up' ? '↑' : '↓';

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="py-5">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
            {change && (
              <p className={cn('text-sm font-medium mt-2 flex items-center gap-1', trendColor)}>
                <span>{trendIcon}</span>
                <span>{change}</span>
              </p>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-joltcab-100 rounded-lg flex items-center justify-center text-joltcab-600">
                {icon}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
