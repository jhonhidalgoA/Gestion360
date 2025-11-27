import "./ProgressStepper.css";

const ProgressStepper = ({ steps, currentStep }) => {
  return (
    <div className="progress-stepper">
      {steps.map((step) => (
        <div
          key={step.id}
          className={`step ${currentStep >= step.id ? "active" : ""} ${
            currentStep > step.id ? "completed" : ""
          }`}
        >
          <div className="step-number">
            {currentStep > step.id ? "✓" : step.id}
          </div>
          <div className="step-label">{step.title}</div>
        </div>
      ))}
    </div>
  );
};

export default ProgressStepper;