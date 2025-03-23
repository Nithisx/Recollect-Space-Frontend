import React from 'react';

const Modal = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-lg font-semibold mb-4">Notification</h2>
                <p>{message}</p>
                <button
                    onClick={onClose}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md">
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
