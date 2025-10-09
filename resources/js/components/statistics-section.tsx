import { statistics } from '@/data/ikapsi-data';

interface StatisticsSectionProps {
    className?: string;
}

export function StatisticsSection({ className = '' }: StatisticsSectionProps) {
    return (
        <section
            className={`border-y border-border bg-muted/30 py-12 ${className}`}
        >
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                    {statistics.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="mb-2 text-3xl font-bold text-primary lg:text-4xl">
                                {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground lg:text-base">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
