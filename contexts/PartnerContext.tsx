
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { PartnerConfig, IndustryType } from '../types';
import { DEFAULT_PARTNER_CONFIG, DEMO_PARTNERS, buildPartnerConfig } from '../config/partnerConfig';
import { getIndustryConfig, IndustryConfig } from '../config/industryConfig';

interface PartnerContextValue {
  /** Current partner configuration */
  config: PartnerConfig;
  /** Industry config derived from partner's industry */
  industryConfig: IndustryConfig;
  /** Update partner config (for dashboard/demo) */
  updateConfig: (updates: Partial<PartnerConfig>) => void;
  /** Switch to a demo partner preset */
  loadDemoPartner: (partnerId: string) => void;
  /** Reset to default LazziPay config */
  resetToDefault: () => void;
  /** Switch industry (updates industry config + resets intents) */
  switchIndustry: (industry: IndustryType) => void;
  /** CSS custom properties derived from brand colors */
  brandCSSVars: Record<string, string>;
}

const PartnerContext = createContext<PartnerContextValue | null>(null);

export const usePartner = (): PartnerContextValue => {
  const ctx = useContext(PartnerContext);
  if (!ctx) {
    throw new Error('usePartner must be used within a PartnerProvider');
  }
  return ctx;
};

interface PartnerProviderProps {
  children: React.ReactNode;
  initialConfig?: Partial<PartnerConfig>;
}

export const PartnerProvider: React.FC<PartnerProviderProps> = ({ children, initialConfig }) => {
  const [config, setConfig] = useState<PartnerConfig>(() => {
    if (initialConfig) {
      return buildPartnerConfig(initialConfig as any);
    }
    return DEFAULT_PARTNER_CONFIG;
  });

  const industryConfig = useMemo(() => getIndustryConfig(config.industry), [config.industry]);

  const updateConfig = useCallback((updates: Partial<PartnerConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...updates,
      brandColors: {
        ...prev.brandColors,
        ...(updates.brandColors || {}),
      },
    }));
  }, []);

  const loadDemoPartner = useCallback((partnerId: string) => {
    const demoConfig = DEMO_PARTNERS[partnerId];
    if (demoConfig) {
      setConfig(demoConfig);
    }
  }, []);

  const resetToDefault = useCallback(() => {
    setConfig(DEFAULT_PARTNER_CONFIG);
  }, []);

  const switchIndustry = useCallback((industry: IndustryType) => {
    setConfig(prev => ({
      ...prev,
      industry,
      allowedIntents: undefined, // reset to all intents for new industry
    }));
  }, []);

  const brandCSSVars = useMemo(() => ({
    '--lazzi-primary': config.brandColors.primary,
    '--lazzi-secondary': config.brandColors.secondary,
    '--lazzi-bg': config.brandColors.background,
    '--lazzi-text': config.brandColors.text || '#FFFFFF',
  }), [config.brandColors]);

  const value = useMemo(() => ({
    config,
    industryConfig,
    updateConfig,
    loadDemoPartner,
    resetToDefault,
    switchIndustry,
    brandCSSVars,
  }), [config, industryConfig, updateConfig, loadDemoPartner, resetToDefault, switchIndustry, brandCSSVars]);

  return (
    <PartnerContext.Provider value={value}>
      {children}
    </PartnerContext.Provider>
  );
};

export default PartnerContext;
