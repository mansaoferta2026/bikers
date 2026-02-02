import { useState, useEffect } from 'react';
import { Save, Loader2, Upload } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { settingsService } from '../../../services/settings';

interface GeneralSettings {
    site_name: string;
    site_logo_url: string;
    primary_color: string;
    secondary_color: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    social_webhook_url?: string;
}

export const GeneralSettingsTab = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<GeneralSettings>({
        site_name: '',
        site_logo_url: '',
        primary_color: '#10b981',
        secondary_color: '#3b82f6',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        social_webhook_url: '',
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const settings = await settingsService.getSettingsByCategory('general');

            const data: any = {};
            settings.forEach(setting => {
                data[setting.key] = setting.value;
            });

            setFormData(prev => ({ ...prev, ...data }));
        } catch (error) {
            console.error('Error loading general settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const settings = Object.entries(formData).map(([key, value]) => ({
                category: 'general',
                key,
                value,
            }));

            await settingsService.bulkUpdateSettings(settings);
            alert('Configuración general guardada exitosamente');
        } catch (error) {
            console.error('Error saving general settings:', error);
            alert('Error al guardar la configuración');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: keyof GeneralSettings, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // TODO: Implement Supabase Storage upload
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({
                ...prev,
                site_logo_url: reader.result as string,
            }));
        };
        reader.readAsDataURL(file);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Site Identity */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Identidad del Sitio</h3>

                {/* Site Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Sitio *
                    </label>
                    <input
                        type="text"
                        value={formData.site_name}
                        onChange={(e) => handleChange('site_name', e.target.value)}
                        placeholder="BIKERS MTB"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                    />
                </div>

                {/* Logo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo del Sitio
                    </label>
                    <div className="flex items-center gap-4">
                        {formData.site_logo_url && (
                            <div className="w-24 h-24 bg-gray-100 rounded border border-gray-300 flex items-center justify-center overflow-hidden">
                                <img
                                    src={formData.site_logo_url}
                                    alt="Logo"
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        )}
                        <label className="cursor-pointer">
                            <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                                <Upload className="h-4 w-4" />
                                <span className="text-sm">Subir Logo</span>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* Colors */}
            <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900">Colores del Tema</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Primary Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Color Primario
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={formData.primary_color}
                                onChange={(e) => handleChange('primary_color', e.target.value)}
                                className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={formData.primary_color}
                                onChange={(e) => handleChange('primary_color', e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                            />
                        </div>
                    </div>

                    {/* Secondary Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Color Secundario
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={formData.secondary_color}
                                onChange={(e) => handleChange('secondary_color', e.target.value)}
                                className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={formData.secondary_color}
                                onChange={(e) => handleChange('secondary_color', e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO */}
            <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900">SEO (Optimización para Buscadores)</h3>

                {/* Meta Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título por Defecto (Meta Title)
                    </label>
                    <input
                        type="text"
                        value={formData.meta_title}
                        onChange={(e) => handleChange('meta_title', e.target.value)}
                        placeholder="BIKERS MTB - Eventos de Mountain Bike en Argentina"
                        maxLength={60}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {formData.meta_title.length}/60 caracteres
                    </p>
                </div>

                {/* Meta Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción por Defecto (Meta Description)
                    </label>
                    <textarea
                        value={formData.meta_description}
                        onChange={(e) => handleChange('meta_description', e.target.value)}
                        placeholder="Descubre los mejores eventos de mountain bike en Argentina..."
                        maxLength={160}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {formData.meta_description.length}/160 caracteres
                    </p>
                </div>

                {/* Meta Keywords */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Palabras Clave (Keywords)
                    </label>
                    <input
                        type="text"
                        value={formData.meta_keywords}
                        onChange={(e) => handleChange('meta_keywords', e.target.value)}
                        placeholder="mountain bike, mtb, eventos, argentina, ciclismo"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Separa las palabras con comas
                    </p>
                </div>
            </div>

            {/* Social Automation */}
            <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900">Automatización Social</h3>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Webhook de Make (Instagram/TikTok)
                    </label>
                    <input
                        type="url"
                        value={formData.social_webhook_url || ''}
                        onChange={(e) => handleChange('social_webhook_url', e.target.value)}
                        placeholder="https://hook.make.com/..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Pega aquí la URL del webhook de Make para publicar automáticamente cuando un evento pasa a "Publicado".
                    </p>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t">
                <Button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2"
                >
                    {saving ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Guardar Cambios
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};
