"use client"
import React, { useState, useCallback, useEffect } from 'react'
import { storage } from '@/lib/storage'
import { TypeGuards, type WizardState as StoredWizardState } from '@/lib/safe-json'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StepConfig {
  id: string
  title: string
  description?: string
  component: React.ComponentType<StepProps>
  validation?: (data: Record<string, unknown>) => boolean | Promise<boolean>
  isOptional?: boolean
  canSkip?: boolean
}

export interface StepProps {
  data: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
  onValidationChange?: (isValid: boolean) => void
  stepId: string
}

export interface MultiStepWizardProps {
  steps: StepConfig[]
  initialData?: Record<string, unknown>
  title?: string
  description?: string
  className?: string
  onComplete?: (data: Record<string, unknown>) => void
  onCancel?: () => void
  onStepChange?: (stepIndex: number, stepId: string) => void
  showProgress?: boolean
  allowBackNavigation?: boolean
  autoSave?: boolean
  persistenceKey?: string
}

export interface WizardState {
  currentStep: number
  data: Record<string, unknown>
  completedSteps: Set<number>
  stepValidation: Record<number, boolean>
}

export function MultiStepWizard({
  steps,
  initialData = {},
  title = "Multi-Step Process",
  description,
  className,
  onComplete,
  onCancel,
  onStepChange,
  showProgress = true,
  allowBackNavigation = true,
  autoSave = false,
  persistenceKey
}: MultiStepWizardProps) {
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 0,
    data: initialData,
    completedSteps: new Set(),
    stepValidation: {}
  })

  const [isValidating, setIsValidating] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<'next' | 'complete' | 'cancel' | null>(null)

  // Load persisted data on mount
  useEffect(() => {
    if (persistenceKey) {
      const saved = storage.local.get<StoredWizardState>(`wizard-${persistenceKey}`)
      if (saved && TypeGuards.isWizardState(saved)) {
        setWizardState(prev => ({
          ...prev,
          ...saved,
          completedSteps: new Set(saved.completedSteps || [])
        }))
      }
    }
  }, [persistenceKey])

  // Auto-save wizard state
  useEffect(() => {
    if (autoSave && persistenceKey) {
      const stateToSave = {
        ...wizardState,
        completedSteps: Array.from(wizardState.completedSteps)
      }
      storage.local.set(`wizard-${persistenceKey}`, stateToSave)
    }
  }, [wizardState, autoSave, persistenceKey])

  const updateWizardState = useCallback((updates: Partial<WizardState>) => {
    setWizardState(prev => ({ ...prev, ...updates }))
  }, [])

  const updateStepData = useCallback((stepData: Record<string, unknown>) => {
    updateWizardState({ data: { ...wizardState.data, ...stepData } })
  }, [wizardState.data, updateWizardState])

  const updateStepValidation = useCallback((stepIndex: number, isValid: boolean) => {
    updateWizardState({
      stepValidation: { ...wizardState.stepValidation, [stepIndex]: isValid }
    })
  }, [wizardState.stepValidation, updateWizardState])

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const currentStepConfig = steps[wizardState.currentStep]
    if (!currentStepConfig) return false
    if (!currentStepConfig.validation) return true

    setIsValidating(true)
    try {
      const isValid = await currentStepConfig.validation(wizardState.data)
      updateStepValidation(wizardState.currentStep, isValid)
      return isValid
    } finally {
      setIsValidating(false)
    }
  }, [steps, wizardState.currentStep, wizardState.data, updateStepValidation])

  const goToStep = useCallback(async (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return

    // Validate current step before moving if going forward
    if (stepIndex > wizardState.currentStep) {
      const isValid = await validateCurrentStep()
      if (!isValid) return
    }

    updateWizardState({ currentStep: stepIndex })
    if (steps[stepIndex]) {
      onStepChange?.(stepIndex, steps[stepIndex].id)
    }
  }, [steps, wizardState.currentStep, validateCurrentStep, updateWizardState, onStepChange])

  const goToNextStep = useCallback(async () => {
    await goToStep(wizardState.currentStep + 1)
  }, [goToStep, wizardState.currentStep])

  const goToPreviousStep = useCallback(() => {
    goToStep(wizardState.currentStep - 1)
  }, [goToStep, wizardState.currentStep])

  const completeWizard = useCallback(async () => {
    // Validate final step
    const isValid = await validateCurrentStep()
    if (!isValid) return

    // Mark all steps as completed
    const allCompletedSteps = new Set(steps.map((_, index) => index))
    updateWizardState({ completedSteps: allCompletedSteps })

    onComplete?.(wizardState.data)
  }, [validateCurrentStep, steps, updateWizardState, onComplete, wizardState.data])

  const handleAction = useCallback(async (action: 'next' | 'complete' | 'cancel') => {
    if (action === 'cancel') {
      setPendingAction('cancel')
      setShowConfirmDialog(true)
      return
    }

    if (action === 'complete') {
      setPendingAction('complete')
      setShowConfirmDialog(true)
      return
    }

    if (action === 'next') {
      await goToNextStep()
    }
  }, [goToNextStep])

  const confirmAction = useCallback(async () => {
    setShowConfirmDialog(false)

    if (pendingAction === 'complete') {
      await completeWizard()
    } else if (pendingAction === 'cancel') {
      if (persistenceKey) {
        storage.local.remove(`wizard-${persistenceKey}`)
      }
      onCancel?.()
    }

    setPendingAction(null)
  }, [pendingAction, completeWizard, onCancel, persistenceKey])

  const currentStepConfig = steps[wizardState.currentStep]
  if (!currentStepConfig) return null
  const isFirstStep = wizardState.currentStep === 0
  const isLastStep = wizardState.currentStep === steps.length - 1
  const progressPercentage = steps.length > 0 ? ((wizardState.currentStep + 1) / steps.length) * 100 : 0
  const isCurrentStepValid = wizardState.stepValidation[wizardState.currentStep] ?? true

  const StepComponent = currentStepConfig.component

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('cancel')}
            className="text-semantic-error hover:text-semantic-error hover:bg-semantic-error/10"
          >
            <X className="w-4 h-4 mr-2"/>
            Cancel
          </Button>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Step {wizardState.currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2"/>

            {/* Step Indicators */}
            <div className="flex items-center justify-between mt-4">
              {steps.map((step, index) => {
                const isCompleted = wizardState.completedSteps.has(index)
                const isCurrent = index === wizardState.currentStep
                const isValidated = wizardState.stepValidation[index]

                return (
                  <div key={step.id} className="flex items-center">
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium border-2 transition-colors",
                      isCompleted ? "bg-semantic-success border-semantic-success text-primary-foreground" :
                      isCurrent ? "bg-accent-primary border-accent-primary text-primary-foreground" :
                      "bg-background border-muted text-muted-foreground"
                    )}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4"/>
                      ) : isValidated === false ? (
                        <AlertCircle className="w-4 h-4"/>
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "w-12 h-0.5 mx-2 transition-colors",
                        isCompleted ? "bg-semantic-success" : "bg-muted"
                      )}/>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{currentStepConfig.title}</CardTitle>
              {currentStepConfig.description && (
                <p className="text-muted-foreground mt-1">{currentStepConfig.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {!currentStepConfig.isOptional && (
                <Badge variant="outline" className="text-semantic-error border-semantic-error/20">
                  Required
                </Badge>
              )}
              {currentStepConfig.canSkip && (
                <Badge variant="outline">Optional</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StepComponent
            data={wizardState.data}
            onChange={updateStepData}
            onValidationChange={(isValid) => updateStepValidation(wizardState.currentStep, isValid)}
            stepId={currentStepConfig.id}/>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <div>
          {allowBackNavigation && !isFirstStep && (
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={isValidating}
            >
              <ChevronLeft className="w-4 h-4 mr-2"/>
              Previous
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {!isCurrentStepValid && (
            <div className="flex items-center space-x-1 text-semantic-error text-sm">
              <AlertCircle className="w-4 h-4"/>
              <span>Please complete all required fields</span>
            </div>
          )}

          {isValidating && (
            <div className="flex items-center space-x-1 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 animate-spin"/>
              <span>Validating...</span>
            </div>
          )}

          {!isLastStep ? (
            <Button
              onClick={() => handleAction('next')}
              disabled={isValidating || !isCurrentStepValid}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2"/>
            </Button>
          ) : (
            <Button
              onClick={() => handleAction('complete')}
              disabled={isValidating || !isCurrentStepValid}
              className="bg-semantic-success hover:bg-semantic-success/90"
            >
              <CheckCircle className="w-4 h-4 mr-2"/>
              Complete
            </Button>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingAction === 'cancel' ? 'Cancel Process?' : 'Complete Process?'}
            </DialogTitle>
            <DialogDescription>
              {pendingAction === 'cancel'
                ? 'Are you sure you want to cancel? All progress will be lost.'
                : 'Are you sure you want to complete this process? This action cannot be undone.'
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              className={pendingAction === 'cancel' ? 'bg-semantic-error hover:bg-semantic-error/90' : ''}
            >
              {pendingAction === 'cancel' ? 'Yes, Cancel' : 'Complete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MultiStepWizard
