import React from 'react';
import { Link } from 'react-router-dom';
import StatNumber from '../atoms/StatNumber';

const StatCard = ({ label, value, sublabel, to }) => {
  const inner = (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full hover:border-blue-200 transition-colors">
      <StatNumber value={value} label={label} sublabel={sublabel} />
    </div>
  );

  return to ? <Link to={to} className="block h-full">{inner}</Link> : inner;
};

export default StatCard;