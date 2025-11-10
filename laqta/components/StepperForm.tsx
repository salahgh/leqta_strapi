"use client";
import { useState } from "react";

const steps = [
  { title: "Your Info" },
  { title: "Project Details" },
  { title: "Confirmation" },
];

export default function StepperForm() {
  const [current, setCurrent] = useState(0);

  function next() {
    setCurrent((c) => Math.min(c + 1, steps.length - 1));
  }
  function prev() {
    setCurrent((c) => Math.max(c - 1, 0));
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* vertical stepper */}
      <ol className="border-l-2 border-primary-500 mb-lg space-y-md">
        {steps.map((step, idx) => (
          <li key={step.title} className="relative ml-sm pl-sm">
            <span
              className={`absolute -left-2 top-1 h-4 w-4 rounded-full border-2 ${
                idx <= current ? "bg-primary-500 border-primary-500" : "border-neutral-300 bg-white"
              }`}
            />
            <span
              className={`text-sm font-medium ${idx === current ? "text-primary-600" : "text-neutral-500"}`}
            >
              {step.title}
            </span>
          </li>
        ))}
      </ol>

      {/* placeholder form section */}
      <div className="border rounded-lg p-lg bg-white shadow">
        <p className="mb-md text-lg font-semibold">
          {steps[current].title}
        </p>
        <p className="text-neutral-600 text-sm mb-lg">
          (Form fields will go here...)
        </p>
        <div className="flex justify-between">
          <button
            disabled={current === 0}
            onClick={prev}
            className="px-4 py-2 border rounded text-neutral-700 disabled:opacity-40"
          >
            Back
          </button>
          {current < steps.length - 1 ? (
            <button
              onClick={next}
              className="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700"
            >
              Next
            </button>
          ) : (
            <button className="px-4 py-2 rounded bg-secondary-600 text-white hover:bg-secondary-700">
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
