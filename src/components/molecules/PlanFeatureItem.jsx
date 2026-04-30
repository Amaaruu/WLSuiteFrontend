import React from 'react';

const PlanFeatureItem = ({ feature }) => {
  return (
    <li className="flex items-start text-gray-700">
      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span className="text-sm font-medium leading-relaxed">{feature}</span>
    </li>
  );
};

export default PlanFeatureItem;