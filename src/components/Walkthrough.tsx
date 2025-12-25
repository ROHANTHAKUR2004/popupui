import { useState, useEffect } from "react";
import { X, ChevronRight, SkipForward } from "lucide-react";
import "./Walkthrough.css";

interface WalkthroughStep {
  target: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

const STEPS: WalkthroughStep[] = [
  {
    target: "tone-buttons",
    title: "Tone Selection",
    description:
      "Choose the emotional tone for your message. Pick from Diplomatic, Friendly, Business, or Playful styles.",
    position: "bottom",
  },
  {
    target: "persona-button",
    title: "Writing Persona",
    description:
      "Select a writing style persona or create your own custom persona.",
    position: "bottom",
  },
  {
    target: "generated-text",
    title: "AI Generated Text",
    description:
      "Your rewritten message appears here, based on the selected tone and persona.",
    position: "top",
  },
  {
    target: "refine-input",
    title: "Refine Your Message",
    description:
      "Type additional instructions here to refine the generated text further.",
    position: "top",
  },
  {
    target: "action-buttons",
    title: "Quick Actions",
    description:
      "Regenerate, copy to clipboard, or insert directly into your document.",
    position: "top",
  },
];

interface WalkthroughProps {
  onComplete: () => void;
  isActive: boolean;
}

export function Walkthrough({ onComplete, isActive }: WalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  useEffect(() => {
    if (!isActive) return;

    const update = () => {
      const el = document.querySelector(
        `[data-walkthrough="${step.target}"]`
      ) as HTMLElement | null;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const width = 260;
      const height = 120;
      const offset = 12;

      let style: React.CSSProperties = {};

      switch (step.position) {
        case "bottom":
          style = {
            top: rect.bottom + offset,
            left: Math.max(
              8,
              Math.min(
                rect.left + rect.width / 2 - width / 2,
                window.innerWidth - width - 8
              )
            ),
          };
          break;
        case "top":
          style = {
            top: rect.top - height - offset,
            left: Math.max(
              8,
              Math.min(
                rect.left + rect.width / 2 - width / 2,
                window.innerWidth - width - 8
              )
            ),
          };
          break;
        case "left":
          style = {
            top: rect.top + rect.height / 2 - height / 2,
            left: rect.left - width - offset,
          };
          break;
        case "right":
          style = {
            top: rect.top + rect.height / 2 - height / 2,
            left: rect.right + offset,
          };
          break;
      }

      setTooltipStyle(style);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [currentStep, step, isActive]);

  if (!isActive) return null;

  const next = () => {
    if (isLast) onComplete();
    else setCurrentStep((n) => n + 1);
  };

  const skip = () => onComplete();

  return (
    <>
      <div className="walkthrough-overlay" />

      <style>
        {`
          [data-walkthrough="${step.target}"] {
            position: relative;
            z-index: 101;
            box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.3),
              0 0 20px rgba(249, 115, 22, 0.2);
            border-radius: 8px;
          }
        `}
      </style>

      <div className="walkthrough-tooltip" style={tooltipStyle}>
        <div className="walkthrough-header">
          <div className="walkthrough-header-left">
            <div className="walkthrough-step-circle">
              {currentStep + 1}
            </div>
            <span className="walkthrough-title">{step.title}</span>
          </div>
          <button className="icon-btn" onClick={skip}>
            <X className="icon-xs" />
          </button>
        </div>

        <div className="walkthrough-body">
          <p className="walkthrough-text">{step.description}</p>
        </div>

        <div className="walkthrough-footer">
          <div className="walkthrough-dots">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={
                  "walkthrough-dot " +
                  (i === currentStep ? "walkthrough-dot--active" : "")
                }
              />
            ))}
          </div>

          <div className="walkthrough-actions">
            <button className="text-btn" onClick={skip}>
              <SkipForward className="icon-xs" />
              <span>Skip</span>
            </button>
            <button className="primary-btn" onClick={next}>
              {isLast ? "Done" : "Next"}
              {!isLast && <ChevronRight className="icon-xs" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
