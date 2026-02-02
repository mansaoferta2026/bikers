import { useState } from 'react';
import { Settings, Building2, CreditCard, Image, Wrench } from 'lucide-react';
import { BusinessInfoTab } from './settings/BusinessInfoTab';
import { PaymentSettingsTab } from './settings/PaymentSettingsTab';
import { LandingContentTab } from './settings/LandingContentTab';
import { GeneralSettingsTab } from './settings/GeneralSettingsTab';

type TabType = 'business' | 'payment' | 'landing' | 'general';

export const AdminSettingsPage = () => {
    const [activeTab, setActiveTab] = useState<TabType>('business');

    const tabs = [
        { id: 'business' as TabType, label: 'Información Comercial', icon: Building2 },
        { id: 'payment' as TabType, label: 'Configuración de Pagos', icon: CreditCard },
        { id: 'landing' as TabType, label: 'Landing Page', icon: Image },
        { id: 'general' as TabType, label: 'General', icon: Wrench },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <Settings className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Configuración del Sitio</h1>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="flex border-b border-gray-200 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap
                                    border-b-2 transition-colors
                                    ${activeTab === tab.id
                                        ? 'border-primary text-primary bg-primary/5'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }
                                `}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'business' && <BusinessInfoTab />}
                    {activeTab === 'payment' && <PaymentSettingsTab />}
                    {activeTab === 'landing' && <LandingContentTab />}
                    {activeTab === 'general' && <GeneralSettingsTab />}
                </div>
            </div>
        </div>
    );
};
