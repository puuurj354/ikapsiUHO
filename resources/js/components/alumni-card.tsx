import { Icon } from '@/components/icon';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, GraduationCap, Mail, User } from 'lucide-react';

interface AlumniCardProps {
    id: number;
    name: string;
    email: string;
    angkatan: string | null;
    profesi: string | null;
    bio: string | null;
}

export function AlumniCard({
    name,
    email,
    angkatan,
    profesi,
    bio,
}: AlumniCardProps) {
    return (
        <Card className="transition-shadow duration-200 hover:shadow-lg">
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                            <Icon
                                iconNode={User}
                                className="h-8 w-8 text-primary"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                        <h3 className="mb-1 truncate text-lg font-semibold">
                            {name}
                        </h3>

                        {/* Info Items */}
                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Icon
                                    iconNode={Mail}
                                    className="mr-2 h-4 w-4 flex-shrink-0"
                                />
                                <span className="truncate">{email}</span>
                            </div>

                            {angkatan && (
                                <div className="flex items-center text-sm">
                                    <Icon
                                        iconNode={GraduationCap}
                                        className="mr-2 h-4 w-4 flex-shrink-0 text-blue-600"
                                    />
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        Angkatan {angkatan}
                                    </Badge>
                                </div>
                            )}

                            {profesi && (
                                <div className="flex items-center text-sm">
                                    <Icon
                                        iconNode={Briefcase}
                                        className="mr-2 h-4 w-4 flex-shrink-0 text-green-600"
                                    />
                                    <span className="truncate text-muted-foreground">
                                        {profesi}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Bio */}
                        {bio && (
                            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                                {bio}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
