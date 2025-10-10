import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import reports from '@/routes/reports';
import { useForm } from '@inertiajs/react';
import { AlertTriangle, Check, Flag, Loader2 } from 'lucide-react';
import React from 'react';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    reportableType: 'App\\Models\\ForumDiscussion' | 'App\\Models\\ForumReply';
    reportableId: number;
    reportedItemTitle?: string;
}

const reportReasons = [
    {
        value: 'spam',
        label: 'Spam',
        description: 'Konten berulang atau tidak relevan',
    },
    {
        value: 'inappropriate',
        label: 'Konten Tidak Pantas',
        description: 'Konten yang tidak sesuai dengan komunitas',
    },
    {
        value: 'offensive',
        label: 'Menyinggung',
        description: 'Konten yang menyinggung atau kasar',
    },
    {
        value: 'harassment',
        label: 'Pelecehan',
        description: 'Pelecehan atau intimidasi terhadap pengguna lain',
    },
    {
        value: 'other',
        label: 'Lainnya',
        description: 'Alasan lain yang perlu ditinjau',
    },
];

export function ReportModal({
    isOpen,
    onClose,
    reportableType,
    reportableId,
    reportedItemTitle,
}: ReportModalProps) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        reportable_type: reportableType,
        reportable_id: reportableId,
        reason: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(reports.store().url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    React.useEffect(() => {
        if (recentlySuccessful) {
            const timer = setTimeout(() => {
                handleClose();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [recentlySuccessful]);

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Flag className="h-5 w-5 text-destructive" />
                        Laporkan Konten
                    </DialogTitle>
                    <DialogDescription>
                        Bantu kami menjaga komunitas dengan melaporkan konten
                        yang melanggar aturan.
                        {reportedItemTitle && (
                            <span className="mt-2 block text-sm font-medium text-foreground">
                                "{reportedItemTitle}"
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label className="text-base font-semibold">
                                Alasan Laporan{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <RadioGroup
                                value={data.reason}
                                onValueChange={(value) =>
                                    setData('reason', value)
                                }
                                className="mt-3 space-y-3"
                            >
                                {reportReasons.map((reason) => (
                                    <div
                                        key={reason.value}
                                        className="flex items-start space-x-3"
                                    >
                                        <RadioGroupItem
                                            value={reason.value}
                                            id={reason.value}
                                            className="mt-1"
                                        />
                                        <Label
                                            htmlFor={reason.value}
                                            className="flex-1 cursor-pointer space-y-1 font-normal"
                                        >
                                            <div className="font-medium">
                                                {reason.label}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {reason.description}
                                            </div>
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                            {errors.reason && (
                                <p className="mt-2 text-sm text-destructive">
                                    {errors.reason}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Detail Tambahan (Opsional)
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Jelaskan lebih detail tentang masalah ini..."
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                rows={4}
                                className="resize-none"
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
                        <div className="flex gap-3">
                            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-500" />
                            <div className="space-y-1 text-sm">
                                <p className="font-medium text-amber-900 dark:text-amber-100">
                                    Laporan akan ditinjau oleh admin
                                </p>
                                <p className="text-amber-700 dark:text-amber-200">
                                    Laporan palsu atau penyalahgunaan fitur
                                    dapat mengakibatkan sanksi pada akun Anda.
                                </p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={processing || !data.reason}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Mengirim...
                                </>
                            ) : (
                                <>
                                    <Flag className="mr-2 h-4 w-4" />
                                    Kirim Laporan
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>

                {recentlySuccessful && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
                        <div className="flex items-center gap-3 rounded-lg border bg-card p-6 shadow-lg">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                <Check className="h-6 w-6 text-green-600 dark:text-green-500" />
                            </div>
                            <div>
                                <p className="font-semibold">
                                    Laporan Terkirim
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Terima kasih atas laporannya
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
