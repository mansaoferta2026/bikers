import { useState, useEffect } from 'react';
import { Save, Loader2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { settingsService } from '../../../services/settings';

interface PaymentSettings {
    mercadopago_public_key: string;
    mercadopago_access_token: string;
    bank_name: string;
    bank_account_number: string;
    bank_account_holder: string;
    bank_cbu_cvu: string;
    payment_terms: string;
    refund_policy: string;
}

export const PaymentSettingsTab = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSecrets, setShowSecrets] = useState(false);
    const [formData, setFormData] = useState<PaymentSettings>({
        mercadopago_public_key: '',
        mercadopago_access_token: '',
        bank_name: '',
        bank_account_number: '',
        bank_account_holder: '',
        bank_cbu_cvu: '',
        payment_terms: '',
        refund_policy: '',
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const settings = await settingsService.getSettingsByCategory('payment');

            const data: any = {};
            settings.forEach(setting => {
                data[setting.key] = setting.value;
            });

            setFormData(prev => ({ ...prev, ...data }));
        } catch (error) {
            console.error('Error loading payment settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const settings = Object.entries(formData).map(([key, value]) => ({
                category: 'payment',
                key,
                value,
            }));

            await settingsService.bulkUpdateSettings(settings);

            // Also update .env file values (for Mercado Pago)
            // Note: This is just for the database. .env needs manual update

            alert('Configuración de pagos guardada exitosamente');
        } catch (error) {
            console.error('Error saving payment settings:', error);
            alert('Error al guardar la configuración');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: keyof PaymentSettings, value: string) => {
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
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Warning Alert */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Información Sensible</p>
                    <p>Las credenciales de pago son confidenciales. Asegúrate de usar credenciales TEST para desarrollo y PROD solo en producción.</p>
                </div>
            </div>

            {/* Mercado Pago Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Mercado Pago</h3>
                    <button
                        type="button"
                        onClick={() => setShowSecrets(!showSecrets)}
                        className="text-sm text-primary hover:text-primary-dark flex items-center gap-2"
                    >
                        {showSecrets ? (
                            <>
                                <EyeOff className="h-4 w-4" />
                                Ocultar
                            </>
                        ) : (
                            <>
                                <Eye className="h-4 w-4" />
                                Mostrar
                            </>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {/* Public Key */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Public Key *
                        </label>
                        <input
                            type={showSecrets ? 'text' : 'password'}
                            value={formData.mercadopago_public_key}
                            onChange={(e) => handleChange('mercadopago_public_key', e.target.value)}
                            placeholder="TEST-abc123... o APP_USR-abc123..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Obtén tus credenciales en: <a href="https://www.mercadopago.com.ar/developers/panel/app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Panel de Desarrolladores</a>
                        </p>
                    </div>

                    {/* Access Token */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Access Token *
                        </label>
                        <input
                            type={showSecrets ? 'text' : 'password'}
                            value={formData.mercadopago_access_token}
                            onChange={(e) => handleChange('mercadopago_access_token', e.target.value)}
                            placeholder="TEST-123456... o APP_USR-123456..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Bank Account Section */}
            <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900">Datos Bancarios (Transferencias)</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bank Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Banco
                        </label>
                        <input
                            type="text"
                            value={formData.bank_name}
                            onChange={(e) => handleChange('bank_name', e.target.value)}
                            placeholder="Ej: Banco Galicia"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    {/* Account Holder */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Titular de la Cuenta
                        </label>
                        <input
                            type="text"
                            value={formData.bank_account_holder}
                            onChange={(e) => handleChange('bank_account_holder', e.target.value)}
                            placeholder="Nombre completo"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    {/* Account Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número de Cuenta
                        </label>
                        <input
                            type="text"
                            value={formData.bank_account_number}
                            onChange={(e) => handleChange('bank_account_number', e.target.value)}
                            placeholder="1234567890"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    {/* CBU/CVU */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            CBU / CVU
                        </label>
                        <input
                            type="text"
                            value={formData.bank_cbu_cvu}
                            onChange={(e) => handleChange('bank_cbu_cvu', e.target.value)}
                            placeholder="0000000000000000000000"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Policies Section */}
            <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900">Políticas</h3>

                {/* Payment Terms */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Términos y Condiciones de Pago
                    </label>
                    <textarea
                        value={formData.payment_terms}
                        onChange={(e) => handleChange('payment_terms', e.target.value)}
                        rows={4}
                        placeholder="Describe los términos de pago..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>

                {/* Refund Policy */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Política de Reembolsos
                    </label>
                    <textarea
                        value={formData.refund_policy}
                        onChange={(e) => handleChange('refund_policy', e.target.value)}
                        rows={4}
                        placeholder="Describe la política de reembolsos..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
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
