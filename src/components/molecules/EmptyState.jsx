import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../atoms/Button';

const EmptyState = ({ message, actionLabel, actionTo }) => (
  <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
    <p className="text-gray-400 text-sm mb-4">{message}</p>
    {actionLabel && actionTo && (
      <Link to={actionTo}>
        <Button variant="primary">{actionLabel}</Button>
      </Link>
    )}
  </div>
);

export default EmptyState;