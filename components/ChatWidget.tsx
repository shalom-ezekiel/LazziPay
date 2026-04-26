
import React from 'react';
import LazziWidget from '../sdk/LazziWidget';
import { usePartner } from '../contexts/PartnerContext';

/**
 * ChatWidget wrapper that connects the Lazzi SDK Widget to the PartnerContext.
 * On the main LazziPay site, this shows the default Lazzi assistant.
 * In SDK mode, it shows the partner's branded assistant.
 */
const ChatWidget: React.FC = () => {
  const { config } = usePartner();

  return (
    <LazziWidget
      config={config}
      onSensitiveAction={(action) => {
        console.log('[Lazzi] Sensitive action requires verification:', action);
        // In demo mode, auto-confirm after a brief delay
        setTimeout(() => action.confirm(), 2000);
      }}
      onIntent={(intent) => {
        console.log('[Lazzi] Intent detected:', intent);
      }}
    />
  );
};

export default ChatWidget;
