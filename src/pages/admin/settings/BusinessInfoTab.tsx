import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { settingsService } from '../../../services/settings';

interface BusinessInfo {
    company_name: string;
    contact_email: string;
    contact_phone: string;
    whatsapp: string;
    address: string;
    instagram: string;
    facebook: string;
    about_us: string;
    business_hours: string;
}

export const BusinessInfoTab = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<BusinessInfo>({
        company_name: '',
        contact_email: '',
        contact_phone: '',
        whatsapp: '',
        address: '',
        instagram: '',
        facebook: '',
        about_us: '',
        business_hours: '',
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const settings = await settingsService.getSettingsByCategory('business');

            const data: any = {};
            settings.forEach(setting => {
                data[setting.key] = setting.value;
            });

            setFormData(prev => ({ ...prev, ...data }));
        } catch (error) {
            console.error('Error loading business settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const settings = Object.entries(formData).map(([key, value]) => ({
                category: 'business',
                key,
                value,
            }));

            await settingsService.bulkUpdateSettings(settings);
            alert('Configuración guardada exitosamente');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Error al guardar la configuración');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: keyof BusinessInfo, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de la Empresa *
                    </label>
                    <input
                        type="text"
                        value={formData.company_name}
                        onChange={(e) => handleChange('company_name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                    />
                </div>

                {/* Contact Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email de Contacto *
                    </label>
                    <input
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => handleChange('contact_email', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                    />
                </div>

                {/* Contact Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono de Contacto
                    </label>
                    <input
                        type="tel"
                        value={formData.contact_phone}
                        onChange={(e) => handleChange('contact_phone', e.target.value)}
                        placeholder="+54 9 11 1234-5678"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>

                {/* WhatsApp */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp
                    </label>
                    <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) => handleChange('whatsapp', e.target.value)}
                        placeholder="+54 9 11 1234-5678"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>

                {/* Instagram */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instagram
                    </label>
                    <input
                        type="text"
                        value={formData.instagram}
                        onChange={(e) => handleChange('instagram', e.target.value)}
                        placeholder="@tu_usuario"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>

                {/* Facebook */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facebook
                    </label>
                    <input
                        type="text"
                        value={formData.facebook}
                        onChange={(e) => handleChange('facebook', e.target.value)}
                        placeholder="https://facebook.com/tu-pagina"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </div>

            {/* Address */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección Física
                </label>
                <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Calle 123, Ciudad, Provincia"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
            </div>

            {/* Business Hours */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horarios de Atención
                </label>
                <input
                    type="text"
                    value={formData.business_hours}
                    onChange={(e) => handleChange('business_hours', e.target.value)}
                    placeholder="Lunes a Viernes: 9:00 - 18:00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
            </div>

            {/* About Us */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sobre Nosotros
                </label>
                <textarea
                    value={formData.about_us}
                    onChange={(e) => handleChange('about_us', e.target.value)}
                    rows={6}
                    placeholder="Describe tu empresa, misión, visión..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
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
