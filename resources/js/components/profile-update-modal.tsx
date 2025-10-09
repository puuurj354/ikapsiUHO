import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

interface ProfileUpdateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentData: {
        angkatan: string | null;
        profesi: string | null;
        bio: string | null;
    };
}

export function ProfileUpdateModal({
    open,
    onOpenChange,
    currentData,
}: ProfileUpdateModalProps) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        angkatan: currentData.angkatan || '',
        profesi: currentData.profesi || '',
        bio: currentData.bio || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        patch('/alumni/profile', {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    };

    const handleClose = () => {
        if (!processing) {
            onOpenChange(false);
            reset();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Update Profil Alumni</DialogTitle>
                    <DialogDescription>
                        Lengkapi informasi profil Anda sebagai alumni IKAPSI UHO
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Angkatan */}
                    <div className="space-y-2">
                        <Label htmlFor="angkatan">Angkatan</Label>
                        <Input
                            id="angkatan"
                            type="text"
                            placeholder="contoh: 2020"
                            value={data.angkatan}
                            onChange={(e) =>
                                setData('angkatan', e.target.value)
                            }
                            maxLength={4}
                            disabled={processing}
                        />
                        {errors.angkatan && (
                            <p className="text-sm text-destructive">
                                {errors.angkatan}
                            </p>
                        )}
                    </div>

                    {/* Profesi */}
                    <div className="space-y-2">
                        <Label htmlFor="profesi">Profesi / Pekerjaan</Label>
                        <Input
                            id="profesi"
                            type="text"
                            placeholder="contoh: Psikolog Klinis"
                            value={data.profesi}
                            onChange={(e) => setData('profesi', e.target.value)}
                            maxLength={255}
                            disabled={processing}
                        />
                        {errors.profesi && (
                            <p className="text-sm text-destructive">
                                {errors.profesi}
                            </p>
                        )}
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio / Deskripsi Singkat</Label>
                        <Textarea
                            id="bio"
                            placeholder="Ceritakan sedikit tentang diri Anda..."
                            value={data.bio}
                            onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>,
                            ) => setData('bio', e.target.value)}
                            maxLength={1000}
                            rows={4}
                            disabled={processing}
                        />
                        <p className="text-xs text-muted-foreground">
                            {data.bio.length}/1000 karakter
                        </p>
                        {errors.bio && (
                            <p className="text-sm text-destructive">
                                {errors.bio}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && (
                                <Icon
                                    iconNode={Loader2}
                                    className="mr-2 h-4 w-4 animate-spin"
                                />
                            )}
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
