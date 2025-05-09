
import React from 'react';

function ConfirmPopup({ onConfirm, onCancel, position = '' }) {
  return (
    <div className={`absolute z-50 bg-white border shadow-lg rounded-md p-3 text-sm ${position}`}>
      <p className="text-gray-800 mb-3 font-medium">Remove from watch history?</p>
      <div className="flex justify-end space-x-3">
        <button onClick={onCancel} className="text-gray-600 hover:underline">Cancel</button>
        <button onClick={onConfirm} className="text-red-600 hover:underline font-semibold">Remove</button>
      </div>
    </div>
  );
}

export default ConfirmPopup;
