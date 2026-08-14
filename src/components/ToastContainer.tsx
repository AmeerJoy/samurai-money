import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useGame();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(toast => (
        <div 
          key={toast.id} 
          className="toast-item"
          onClick={() => dismissToast(toast.id)}
        >
          <img 
            src={toast.iconAssetUrl} 
            alt="Achievement Icon" 
            className="toast-icon" 
          />
          <div className="toast-content" style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Trophy size={12} color="#F59E0B" />
              <span className="toast-title">{toast.title}</span>
            </div>
            <span className="toast-subtitle">{toast.subtitle}</span>
          </div>
          <button 
            className="modal-close-btn"
            style={{ width: 24, height: 24 }}
            onClick={(e) => {
              e.stopPropagation();
              dismissToast(toast.id);
            }}
            aria-label="Dismiss Toast"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
