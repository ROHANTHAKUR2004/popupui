import { Sparkles, Crown } from "lucide-react";
import "./UpgradePrompt.css";

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  feature: string;
}

export function UpgradePrompt({
  isOpen,
  onClose,
  onUpgrade,
  feature,
}: UpgradePromptProps) {
  if (!isOpen) return null;

  return (
    <div className="upgrade-overlay">
      <div className="upgrade-card">

        <div className="upgrade-icon">
          <div className="upgrade-icon-circle">
            <Crown className="icon-md icon-primary" />
          </div>
        </div>

        <div className="upgrade-content">
          <h3 className="upgrade-title">Upgrade to Pro</h3>
          <p className="upgrade-text">
            {feature} is available on the Pro plan. Unlock unlimited tones, personas, and more.
          </p>
        </div>

        <div className="upgrade-actions">
          <button
            onClick={onClose}
            className="upgrade-secondary-btn"
          >
            Maybe later
          </button>
          <button
            onClick={() => {
              onUpgrade();
              onClose();
            }}
            className="primary-btn upgrade-primary-btn"
          >
            <Sparkles className="icon-xs" />
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
}
