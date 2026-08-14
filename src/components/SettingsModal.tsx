import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { exportSaveString, importSaveString, saveGameState } from '../systems/save';
import { X, Settings, Volume2, Music, Sparkles, Hash, Trash2, Download, Upload } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { state, activeModal, setActiveModal, updateSettings, resetGame } = useGame();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importString, setImportString] = useState('');
  const [importMessage, setImportMessage] = useState('');

  if (activeModal !== 'settings') return null;

  const handleExport = () => {
    const exported = exportSaveString(state);
    navigator.clipboard.writeText(exported);
    setImportMessage('Save string copied to clipboard!');
    setTimeout(() => setImportMessage(''), 3000);
  };

  const handleImport = () => {
    if (!importString.trim()) return;
    const imported = importSaveString(importString);
    if (imported) {
      saveGameState(imported);
      window.location.reload();
    } else {
      setImportMessage('Invalid save string.');
      setTimeout(() => setImportMessage(''), 3000);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setActiveModal('none')}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Settings size={20} color="#D20A2E" />
            <h3 className="modal-title">SETTINGS</h3>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={() => setActiveModal('none')}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Audio Controls */}
        <div className="setting-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Volume2 size={16} color="#F59E0B" />
              <span className="setting-label">Sound Effects</span>
            </div>
            <span className="setting-desc">Katana slashes, coins, purchase sounds</span>
          </div>
          <input
            type="checkbox"
            checked={state.settings.soundEnabled}
            onChange={e => updateSettings({ soundEnabled: e.target.checked })}
            style={{ transform: 'scale(1.3)', cursor: 'pointer' }}
          />
        </div>

        <div className="setting-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Music size={16} color="#F59E0B" />
              <span className="setting-label">Zen Ambient Sound</span>
            </div>
            <span className="setting-desc">Subtle meditative ambient hum</span>
          </div>
          <input
            type="checkbox"
            checked={state.settings.musicEnabled}
            onChange={e => updateSettings({ musicEnabled: e.target.checked })}
            style={{ transform: 'scale(1.3)', cursor: 'pointer' }}
          />
        </div>

        {/* Visual Settings */}
        <div className="setting-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={16} color="#D20A2E" />
              <span className="setting-label">Floating Numbers</span>
            </div>
            <span className="setting-desc">Display animated +$ on clicks</span>
          </div>
          <input
            type="checkbox"
            checked={state.settings.showFloatingNumbers}
            onChange={e => updateSettings({ showFloatingNumbers: e.target.checked })}
            style={{ transform: 'scale(1.3)', cursor: 'pointer' }}
          />
        </div>

        <div className="setting-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Hash size={16} color="#10B981" />
              <span className="setting-label">Number Notation</span>
            </div>
            <span className="setting-desc">Standard ($1.25M) vs Scientific (1.25e6)</span>
          </div>
          <select
            value={state.settings.numberFormat}
            onChange={e => updateSettings({ numberFormat: e.target.value as 'standard' | 'scientific' })}
            style={{
              background: '#1A1B26',
              color: '#FFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: 6,
              padding: '4px 8px',
              cursor: 'pointer'
            }}
          >
            <option value="standard">Standard ($1.25M)</option>
            <option value="scientific">Scientific (1.25e6)</option>
          </select>
        </div>

        {/* Cloud Save / Export / Import */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
          <span className="setting-label">Save Backup & Transfer</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              className="icon-btn" 
              onClick={handleExport}
              style={{ width: 'auto', flex: 1, padding: '0 12px', fontSize: '0.8rem', gap: 6 }}
            >
              <Download size={14} />
              <span>Export Save</span>
            </button>
            <button 
              className="icon-btn" 
              onClick={handleImport}
              style={{ width: 'auto', flex: 1, padding: '0 12px', fontSize: '0.8rem', gap: 6 }}
            >
              <Upload size={14} />
              <span>Import Save</span>
            </button>
          </div>
          <input
            type="text"
            placeholder="Paste exported save string here..."
            value={importString}
            onChange={e => setImportString(e.target.value)}
            style={{
              background: '#141620',
              border: '1px solid var(--border-subtle)',
              borderRadius: 8,
              padding: '8px 12px',
              color: '#FFF',
              fontSize: '0.8rem'
            }}
          />
          {importMessage && (
            <span style={{ fontSize: '0.75rem', color: '#FCD34D' }}>{importMessage}</span>
          )}
        </div>

        {/* Hard Reset */}
        {!showResetConfirm ? (
          <button 
            className="danger-modal-btn" 
            onClick={() => setShowResetConfirm(true)}
            style={{ marginTop: 8 }}
          >
            <Trash2 size={14} style={{ display: 'inline', marginRight: 6 }} />
            RESET GAME PROGRESS
          </button>
        ) : (
          <div style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid #DC2626', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: '0.85rem', color: '#FECDD3', fontWeight: 700 }}>
              Are you sure? This will permanently erase your empire and start fresh!
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                className="danger-modal-btn" 
                onClick={resetGame}
                style={{ flex: 1, background: '#DC2626', color: '#FFF' }}
              >
                YES, RESET
              </button>
              <button 
                className="icon-btn" 
                onClick={() => setShowResetConfirm(false)}
                style={{ flex: 1, width: 'auto' }}
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
