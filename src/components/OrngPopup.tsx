import { useState } from "react";
import {
  ChevronDown,
  Send,
  Copy,
  Check,
  RotateCcw,
  X,
  Sparkles,
  HelpCircle,
  Plus,
  Lock,
} from "lucide-react";
import { Walkthrough } from "./Walkthrough";
import { UpgradePrompt } from "./UpgradePrompt";
import "./OrngPopup.css";

const DEFAULT_TONES = [
  { emoji: "🎙️", label: "Diplomatic" },
  { emoji: "🥳", label: "Friendly" },
  { emoji: "💼", label: "Business" },
  { emoji: "🤪", label: "Playful" },
];

const FREE_TIER_TONE_LIMIT = 3;

const PERSONAS = [
  { name: "Elon Musk", description: "Bold, visionary style with tech-forward language" },
  { name: "Shakespeare", description: "Eloquent, poetic prose with classic flair" },
  { name: "Default", description: "Clean, professional communication" },
];

const EMOJI_OPTIONS = ["😊", "🔥", "💡", "🎯", "✨", "🚀", "💪", "🎨", "📈", "🤝", "💎", "⚡"];

interface CustomPersona {
  name: string;
  style: string;
  traits: string;
}

interface Tone {
  emoji: string;
  label: string;
}

type BorderState = "waiting" | "thinking" | "completed";

export function OrngPopup() {
  const [isPro, setIsPro] = useState(false);
  const [tones, setTones] = useState<Tone[]>(DEFAULT_TONES);
  const [selectedTone, setSelectedTone] = useState(DEFAULT_TONES[0]);
  const [selectedPersona, setSelectedPersona] = useState("Default");
  const [isLoading, setIsLoading] = useState(false);
  const [borderState, setBorderState] = useState<BorderState>("waiting");
  const [customPrompt, setCustomPrompt] = useState("");
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCustomPersonaEditor, setShowCustomPersonaEditor] = useState(false);
  const [showCustomToneEditor, setShowCustomToneEditor] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState("");
  const [customPersona, setCustomPersona] = useState<CustomPersona>({
    name: "",
    style: "",
    traits: "",
  });
  const [customTone, setCustomTone] = useState<Tone>({
    emoji: "😊",
    label: "",
  });

  const visibleTones = isPro ? tones : tones.slice(0, FREE_TIER_TONE_LIMIT);

  const handleUpgradePrompt = (feature: string) => {
    setUpgradeFeature(feature);
    setShowUpgradePrompt(true);
  };

  const handleUpgrade = () => {
    setIsPro(true);
  };

  const runAI = () => {
    setIsLoading(true);
    setBorderState("thinking");
    setTimeout(() => {
      setIsLoading(false);
      setBorderState("completed");
    }, 1200);
  };

  const handleToneSelect = (tone: Tone) => {
    setSelectedTone(tone);
    runAI();
  };

  const handleSaveCustomTone = () => {
    if (customTone.label.trim()) {
      const newTone = { ...customTone };
      setTones((prev) => [...prev, newTone]);
      setSelectedTone(newTone);
      setShowCustomToneEditor(false);
      setCustomTone({ emoji: "😊", label: "" });
      runAI();
    }
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePersonaSelect = (personaName: string) => {
    if (personaName === "Custom") {
      setShowCustomPersonaEditor(true);
    } else {
      setSelectedPersona(personaName);
    }
    setShowPersonaDropdown(false);
  };

  const handleSaveCustomPersona = () => {
    if (customPersona.name.trim()) {
      setSelectedPersona(customPersona.name);
      setShowCustomPersonaEditor(false);
      runAI();
    }
  };

  const popupBorderClass =
    borderState === "waiting"
      ? "popup--waiting"
      : borderState === "thinking"
      ? "popup--thinking"
      : "popup--completed";

  /* ---------- Custom Persona Editor ---------- */

  if (showCustomPersonaEditor) {
    return (
      <div className="popup popup--plain">
        <div className="popup-header popup-header--sub">
          <div className="popup-header-left">
            <Sparkles className="icon-sm icon-primary" />
            <span className="header-title">Create Custom Persona</span>
          </div>
          <button
            onClick={() => setShowCustomPersonaEditor(false)}
            className="icon-btn"
          >
            <X className="icon-sm" />
          </button>
        </div>

        <div className="popup-body form-body">
          <div className="field">
            <label className="field-label">Persona Name</label>
            <input
              type="text"
              value={customPersona.name}
              onChange={(e) =>
                setCustomPersona((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Marketing Guru, Tech Enthusiast"
              className="field-input"
            />
          </div>

          <div className="field">
            <label className="field-label">Writing Style</label>
            <input
              type="text"
              value={customPersona.style}
              onChange={(e) =>
                setCustomPersona((prev) => ({ ...prev, style: e.target.value }))
              }
              placeholder="e.g., Casual, Formal, Enthusiastic, Witty"
              className="field-input"
            />
          </div>

          <div className="field">
            <label className="field-label">Key Traits & Instructions</label>
            <textarea
              value={customPersona.traits}
              onChange={(e) =>
                setCustomPersona((prev) => ({ ...prev, traits: e.target.value }))
              }
              placeholder="Describe the personality, use of emojis, sentence structure, vocabulary..."
              rows={3}
              className="field-textarea"
            />
          </div>

          <div className="field">
            <label className="field-label">Quick Presets</label>
            <div className="presets-row">
              {["Uses emojis 🎉", "Short sentences", "Data-driven", "Storyteller", "Minimalist"].map(
                (preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() =>
                      setCustomPersona((prev) => ({
                        ...prev,
                        traits: prev.traits ? `${prev.traits}, ${preset}` : preset,
                      }))
                    }
                    className="preset-chip"
                  >
                    {preset}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="popup-footer popup-footer--right">
          <button
            onClick={() => setShowCustomPersonaEditor(false)}
            className="text-btn"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveCustomPersona}
            disabled={!customPersona.name.trim()}
            className="primary-btn"
          >
            Save &amp; Apply
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Custom Tone Editor ---------- */

  if (showCustomToneEditor) {
    return (
      <div className="popup popup--plain">
        <div className="popup-header popup-header--sub">
          <div className="popup-header-left">
            <Sparkles className="icon-sm icon-primary" />
            <span className="header-title">Create Custom Tone</span>
          </div>
          <button
            onClick={() => setShowCustomToneEditor(false)}
            className="icon-btn"
          >
            <X className="icon-sm" />
          </button>
        </div>

        <div className="popup-body form-body">
          <div className="field">
            <label className="field-label">Choose Emoji</label>
            <div className="emoji-grid">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() =>
                    setCustomTone((prev) => ({
                      ...prev,
                      emoji,
                    }))
                  }
                  className={
                    "emoji-btn " +
                    (customTone.emoji === emoji ? "emoji-btn--active" : "")
                  }
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="field-label">Tone Name</label>
            <input
              type="text"
              value={customTone.label}
              onChange={(e) =>
                setCustomTone((prev) => ({ ...prev, label: e.target.value }))
              }
              placeholder="e.g., Confident, Empathetic, Urgent"
              className="field-input"
            />
          </div>

          <div className="field">
            <label className="field-label">Preview</label>
            <div className="tone-preview">
              <span className="tone-preview-pill">
                {customTone.emoji} {customTone.label || "Your Tone"}
              </span>
            </div>
          </div>
        </div>

        <div className="popup-footer popup-footer--right">
          <button
            onClick={() => setShowCustomToneEditor(false)}
            className="text-btn"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveCustomTone}
            disabled={!customTone.label.trim()}
            className="primary-btn"
          >
            Save &amp; Apply
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Main Popup ---------- */

  return (
    <>
      <Walkthrough
        isActive={showWalkthrough}
        onComplete={() => setShowWalkthrough(false)}
      />

      <div className={`popup ${popupBorderClass}`}>
        <UpgradePrompt
          isOpen={showUpgradePrompt}
          onClose={() => setShowUpgradePrompt(false)}
          onUpgrade={handleUpgrade}
          feature={upgradeFeature}
        />

        {/* Header */}
        <div className="popup-header">
          <div className="popup-header-left">
            <button
              onClick={() => setShowWalkthrough(true)}
              className="icon-btn icon-btn--circle"
              title="Start walkthrough"
            >
              <HelpCircle className="icon-sm" />
            </button>

            <div className="tone-scroll" data-walkthrough="tone-buttons">
              <div className="tone-scroll-inner">
                {visibleTones.map((tone) => (
                  <button
                    key={tone.label}
                    onClick={() => handleToneSelect(tone)}
                    className={
                      "tone-chip " +
                      (selectedTone.label === tone.label ? "tone-chip--active" : "")
                    }
                  >
                    {tone.emoji} {tone.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    isPro
                      ? setShowCustomToneEditor(true)
                      : handleUpgradePrompt("Custom tones")
                  }
                  className={
                    "tone-add " + (isPro ? "tone-add--pro" : "tone-add--locked")
                  }
                  title={isPro ? "Add custom tone" : "Pro feature"}
                >
                  {isPro ? (
                    <Plus className="icon-xs" />
                  ) : (
                    <Lock className="icon-xs" />
                  )}
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          <div className="divider-vertical" />

          <div
            className="persona-wrapper"
            data-walkthrough="persona-button"
          >
            <button
              onClick={() =>
                isPro
                  ? setShowPersonaDropdown(!showPersonaDropdown)
                  : handleUpgradePrompt("Custom personas")
              }
              className={
                "persona-pill " + (!isPro ? "persona-pill--locked" : "")
              }
            >
              {!isPro && <Lock className="icon-xs" />}
              <span className="persona-label">
                {isPro ? selectedPersona : "Persona"}
              </span>
              {isPro && (
                <ChevronDown
                  className={
                    "icon-xs " +
                    (showPersonaDropdown ? "icon-rotated" : "")
                  }
                />
              )}
            </button>

            {showPersonaDropdown && isPro && (
              <div className="persona-dropdown">
                <div className="persona-dropdown-header">
                  <span className="persona-dropdown-title">Writing Style</span>
                </div>
                {PERSONAS.map((persona) => (
                  <button
                    key={persona.name}
                    onClick={() => handlePersonaSelect(persona.name)}
                    className={
                      "persona-item " +
                      (selectedPersona === persona.name
                        ? "persona-item--active"
                        : "")
                    }
                  >
                    <span
                      className={
                        "persona-item-name " +
                        (selectedPersona === persona.name
                          ? "persona-item-name--active"
                          : "")
                      }
                    >
                      {persona.name}
                    </span>
                    <span className="persona-item-desc">
                      {persona.description}
                    </span>
                  </button>
                ))}
                
                <div className="persona-divider" />
                
                <button
                  onClick={() => {
                    setShowCustomPersonaEditor(true);
                    setShowPersonaDropdown(false);
                  }}
                  className="persona-add-btn"
                >
                  <div className="persona-add-icon">
                    <Plus className="icon-xs" />
                  </div>
                  <span className="persona-add-text">Create Custom Persona</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div
          className="popup-body popup-body--main"
          data-walkthrough="generated-text"
        >
          <div className="popup-text">
            {isLoading ? (
              <div className="skeleton-stack">
                <div className="skeleton-line" />
                <div className="skeleton-line skeleton-line--w90" />
                <div className="skeleton-line skeleton-line--w80" />
                <div className="skeleton-line skeleton-line--w70" />
              </div>
            ) : (
              <p className="generated-text">
                I wanted to check in on the project's progress. Are there any
                challenges or resources needed? Please let me know if there's
                anything you need help with or if you need additional support
                 I wanted to check in on the project's progress. Are there any
                challenges or resources needed? Please let me know if there's
                anything you need help with or if you need additional support               
              </p>
            )}
          </div>

          {/* Footer / actions */}
          <div className="popup-footer popup-footer--main">
            <div
              className="refine"
              data-walkthrough="refine-input"
            >
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Refine..."
              />
              <button className="send-btn">
                <Send className="icon-xs" />
              </button>
            </div>

            <div
              className="footer-actions"
              data-walkthrough="action-buttons"
            >
              <button
                onClick={runAI}
                className="icon-btn"
                title="Regenerate"
              >
                <RotateCcw className="icon-sm" />
              </button>
              <button
                onClick={handleCopy}
                className="icon-btn"
                title="Copy"
              >
                {copied ? (
                  <Check className="icon-sm icon-primary" />
                ) : (
                  <Copy className="icon-sm" />
                )}
              </button>
              <button className="primary-btn primary-btn--compact">
                Insert ↵
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
