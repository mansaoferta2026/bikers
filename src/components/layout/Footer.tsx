
import { useState, useEffect } from 'react';
import { Bike, Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { settingsService } from '../../services/settings';

export const Footer = () => {
    const [settings, setSettings] = useState<any>({});

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const businessSettings = await settingsService.getSettingsByCategory('business');
                const generalSettings = await settingsService.getSettingsByCategory('general');

                const settingsMap: any = {};
                [...businessSettings, ...generalSettings].forEach(s => {
                    settingsMap[s.key] = s.value;
                });

                setSettings(settingsMap);
            } catch (error) {
                console.error('Error loading footer settings:', error);
            }
        };

        loadSettings();
    }, []);

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-200 py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 font-bold text-xl text-white">
                            {settings.site_logo_url ? (
                                <img src={settings.site_logo_url} alt="Logo" className="h-8 w-8 object-contain" />
                            ) : (
                                <Bike className="h-6 w-6" />
                            )}
                            <span>{settings.site_name || 'MTB-X'}</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            {settings.about_us?.substring(0, 150) || 'Organizamos las mejores aventuras en bicicleta de montaña. Descubre nuevos senderos y supera tus límites.'}
                            {settings.about_us?.length > 150 && '...'}
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Explorar</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/events" className="hover:text-white transition-colors">Salidas</Link></li>
                            <li><Link to="/subscriptions" className="hover:text-white transition-colors">Planes</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Contacto</h3>
                        <ul className="space-y-3 text-sm">
                            {settings.address && (
                                <li className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 mt-1 text-primary" />
                                    <span>{settings.address}</span>
                                </li>
                            )}
                            {settings.contact_email && (
                                <li className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <a href={`mailto:${settings.contact_email}`} className="hover:text-white">{settings.contact_email}</a>
                                </li>
                            )}
                            {settings.contact_phone && (
                                <li className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <a href={`tel:${settings.contact_phone}`} className="hover:text-white">{settings.contact_phone}</a>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Síguenos</h3>
                        <div className="flex gap-4">
                            {settings.facebook && (
                                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    <Facebook className="h-5 w-5" />
                                </a>
                            )}
                            {settings.instagram && (
                                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    <Instagram className="h-5 w-5" />
                                </a>
                            )}
                            {/* Static fallback if no social media configured yet, or simple defaults */}
                            {!settings.facebook && !settings.instagram && (
                                <span className="text-sm text-slate-500">Próximamente en redes</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
                    © {currentYear} {settings.company_name || settings.site_name || 'MTB-X'}. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
};
