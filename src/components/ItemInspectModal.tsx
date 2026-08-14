import React from 'react';
import { useGame } from '../context/GameContext';
import { formatMoney } from '../systems/formatting';
import { getAssetUrl } from '../assets/assets';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';

export const ItemInspectModal: React.FC = () => {
  const { inspectItem, setInspectItem, state, buyShopItem } = useGame();

  if (!inspectItem) return null;

  const isOwned = state.ownedItemIds.includes(inspectItem.id);
  const canAfford = state.money >= inspectItem.cost && !isOwned;

  return (
    <div className="modal-overlay" onClick={() => setInspectItem(null)}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ textAlign: 'center', alignItems: 'center' }}>
        <div className="modal-header" style={{ width: '100%' }}>
          <div className={`item-rarity-badge rarity-${inspectItem.rarity}`} style={{ position: 'static' }}>
            {inspectItem.rarity}
          </div>
          <button 
            className="modal-close-btn" 
            onClick={() => setInspectItem(null)}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Large Artwork */}
        <div style={{ width: 140, height: 140, borderRadius: 16, background: 'rgba(0,0,0,0.6)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px 0', overflow: 'hidden' }}>
          <img 
            src={getAssetUrl(inspectItem.assetId)} 
            alt={inspectItem.name}
            style={{ width: '85%', height: '85%', objectFit: 'contain' }}
          />
        </div>

        <h3 className="modal-title" style={{ fontSize: '1.25rem' }}>{inspectItem.name}</h3>

        {/* Stat Effect */}
        <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 10, padding: '8px 16px', color: '#10B981', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={16} />
          <span>{inspectItem.effect}</span>
        </div>

        {/* Lore Description */}
        <p style={{ fontSize: '0.85rem', color: '#9CA3AF', lineHeight: 1.6, padding: '0 8px' }}>
          {inspectItem.description}
        </p>

        {/* Action Button */}
        {isOwned ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#FCD34D', fontWeight: 700, margin: '8px 0' }}>
            <CheckCircle2 size={18} color="#10B981" />
            <span>ALREADY OWNED IN IMPERIAL ARMORY</span>
          </div>
        ) : (
          <button
            id="inspect-buy-btn"
            className="primary-modal-btn"
            disabled={!canAfford}
            onClick={() => {
              if (canAfford) {
                buyShopItem(inspectItem.id);
                setInspectItem(null);
              }
            }}
            style={{ marginTop: 8 }}
          >
            {canAfford ? `PURCHASE FOR ${formatMoney(inspectItem.cost, state.settings.numberFormat)}` : `REQUIRES ${formatMoney(inspectItem.cost, state.settings.numberFormat)}`}
          </button>
        )}
      </div>
    </div>
  );
};
