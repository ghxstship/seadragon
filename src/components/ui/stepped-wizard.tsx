
'use client';

import * as React from 'react';
import { useState, useCallback } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<StepProps>;
  validate?: (data: Record<string, unknown>) => ValidationResult;
  optional?: boolean;
}

export interface StepProps {
  data: Record<string, unknown>;
  errors: Record<string, string>;
  onUpdate: (updates: Record<string, unknown>) => void;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

interface SteppedWizardProps {
  steps: WizardStep[];
  onComplete: (data: Record<string, unknown>) => void | Promise<void>;
  onCancel?: () => void;
  initialData?: Record<string, unknown>;
  className?: string;
  showStepNumbers?: boolean;
  allowSkip?: boolean;
}

export function SteppedWizard({
  steps,
  onComplete,
  onCancel,
  initialData = {},
  className,
  showStepNumbers = true,
  allowSkip = false,
}: SteppedWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const step = steps[currentStep];

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    if (!step.validate) return true;

    const result = await step.validate(formData);
    if (!result.valid) {
      setErrors(result.errors);
      return false;
    }

    setErrors({});
    return true;
  }, [step, formData]);

  const goToNext = useCallback(async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    setCompletedSteps((prev) => new Set([...prev, currentStep]));

    if (isLastStep) {
      setIsSubmitting(true);
      try {
        await onComplete(formData);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }, [validateCurrentStep, isLastStep, currentStep, formData, onComplete]);

  const goToPrevious = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
      setErrors({});
    }
  }, [isFirstStep]);

  const goToStep = useCallback((index: number) => {
    if (index < currentStep || completedSteps.has(index - 1) || allowSkip) {
      setCurrentStep(index);
      setErrors({});
    }
  }, [currentStep, completedSteps, allowSkip]);

  const handleUpdate = useCallback((updates: Record<string, unknown>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const updatedKeys = Object.keys(updates);
    setErrors((prev) => {
      const newErrors = { ...prev };
      updatedKeys.forEach((key) => delete newErrors[key]);
      return newErrors;
    });
  }, []);

  const StepComponent = step.component;

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      {/* Progress Indicator */}
      <nav className="mb-8" aria-label="Progress">
        <ol className="flex items-center">
          {steps.map((s, index) => {
            const isCompleted = completedSteps.has(index);
            const isCurrent = index === currentStep;
            const isClickable = index < currentStep || completedSteps.has(index - 1) || allowSkip;

            return (
              <li
                key={s.id}
                className={cn(
                  'relative flex-1',
                  index !== steps.length - 1 && 'pr-8 sm:pr-20'
                )}
              >
                {/* Connector line */}
                {index !== steps.length - 1 && (
                  <div
                    className={cn(
                      'absolute top-4 left-8 -right-4 h-0.5',
                      isCompleted ? 'bg-accent-primary' : 'bg-border-default'
                    )}
                    aria-hidden="true"
                  />
                )}

                <button
                  onClick={() => isClickable && goToStep(index)}
                  disabled={!isClickable}
                  className={cn(
                    'relative flex flex-col items-start group',
                    isClickable && 'cursor-pointer'
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {/* Step indicator */}
                  <span
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
                      'transition-colors duration-200',
                      isCompleted
                        ? 'bg-accent-primary text-white'
                        : isCurrent
                        ? 'border-2 border-accent-primary text-accent-primary bg-bg-primary'
                        : 'border-2 border-border-default text-text-muted bg-bg-primary'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : showStepNumbers ? (
                      index + 1
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-current" />
                    )}
                  </span>

                  {/* Step title */}
                  <span
                    className={cn(
                      'mt-2 text-sm font-medium',
                      isCurrent ? 'text-accent-primary' : 'text-text-muted',
                      isClickable && 'group-hover:text-text-primary'
                    )}
                  >
                    {s.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Progress bar */}
        <div className="mt-4 h-1 bg-border-default rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-primary transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </nav>

      {/* Step Content */}
      <div className="bg-bg-elevated border border-border-default rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-text-primary">{step.title}</h2>
          {step.description && (
            <p className="mt-1 text-text-muted">{step.description}</p>
          )}
        </div>

        <div
          className="animate-in fade-in slide-in-from-right-2 duration-300"
          key={step.id}
        >
          <StepComponent
            data={formData}
            errors={errors}
            onUpdate={handleUpdate}
          />
        </div>
      </div>

      {/* Navigation */}
      <footer className="flex items-center justify-between mt-6">
        <div>
          {onCancel && (
            <button
              onClick={onCancel}
              className={cn(
                'px-4 py-2 text-sm font-medium text-text-muted',
                'hover:text-text-primary transition-colors'
              )}
            >
              Cancel
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={goToPrevious}
            disabled={isFirstStep}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg',
              'text-sm font-medium',
              'border border-border-default',
              'hover:bg-surface-hover transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={goToNext}
            disabled={isSubmitting}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg',
              'text-sm font-medium text-white',
              'bg-accent-primary hover:bg-accent-secondary',
              'transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : isLastStep ? (
              'Complete'
            ) : (
              <>
                Continue
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}

export default SteppedWizard;
