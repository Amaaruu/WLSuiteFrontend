// Barra de progreso del formulario. Recibe los pasos y el paso actual.
import React from 'react';
import StepDot from '../atoms/StepDot';

const StepperBar = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progreso del formulario" className="w-full">
      <div className="flex items-start justify-between relative">
        <div className="absolute top-4 left-0 right-0 h-px bg-gray-200 -z-0" aria-hidden="true">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const status =
            stepNumber < currentStep  ? 'completed'
            : stepNumber === currentStep ? 'active'
            : 'pending';

          return (
            <div key={step.id} className="z-10 flex-1 flex flex-col items-center first:items-start last:items-end">
              <StepDot
                stepNumber={stepNumber}
                label={step.label}
                status={status}
              />
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default StepperBar;