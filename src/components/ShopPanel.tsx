import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { SHOP_ITEMS } from '../data/items';
import { ItemCategory } from '../types';
import { formatMoney } from '../systems/formatting';
import { getAssetUrl } from '../assets/assets';
import { ShoppingBag, Sword, Shield, Gem } from 'lucide-react';

export const ShopPanel: React.FC = () => {
  const { state, buyShopItem, setInspectItem } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');

  const categories: { id: ItemCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Items', icon: <ShoppingBag size={14} /> },
    { id: 'sword', label: 'Weapons', icon: <Sword size={14} /> },
    { id: 'armor', label: 'Armor', icon: <Shield size={14} /> },
    { id: 'treasure', label: 'Treasures', icon: <Gem size={14} /> }
  ];

  const filteredItems = SHOP_ITEMS.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="panel-card">
      <div className="panel-header-row">
        <h2 className="panel-title">
          <ShoppingBag size={20} color="#D20A2E" />
          IMPERIAL ARMORY & SHOP
        </h2>
        <span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>
          {state.ownedItemIds.length} / {SHOP_ITEMS.length} Relics Collected
        </span>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat.id}
            id={`shop-cat-${cat.id}`}
            className={`category-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Shop Grid */}
      <div className="shop-grid">
        {filteredItems.map(item => {
          const isOwned = state.ownedItemIds.includes(item.id);
          const canAfford = state.money >= item.cost && !isOwned;
          const progressPct = Math.min(100, Math.max(0, item.cost > 0 ? (state.money / item.cost) * 100 : 0));

          return (
            <div
              key={item.id}
              id={`shop-item-${item.id}`}
              className={`shop-item-card ${isOwned ? 'owned' : ''}`}
              onClick={() => setInspectItem(item)}
            >
              <div className={`item-rarity-badge rarity-${item.rarity}`}>
                {item.rarity}
              </div>

              <div className="shop-item-icon-box">
                <img 
                  src={getAssetUrl(item.assetId)} 
                  alt={item.name} 
                  loading="lazy"
                />
              </div>

              <span className="shop-item-name">{item.name}</span>
              <span className="shop-item-effect">{item.effect}</span>

              <button
                id={`shop-buy-${item.id}`}
                className={`shop-buy-btn ${isOwned ? 'owned' : canAfford ? 'affordable' : ''}`}
                disabled={isOwned || !canAfford}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isOwned && canAfford) {
                    buyShopItem(item.id);
                  }
                }}
              >
                {isOwned ? 'OWNED' : formatMoney(item.cost, state.settings.numberFormat)}
              </button>

              {/* Stylish Visual Progress Gauge */}
              {!isOwned && !canAfford && (
                <div className="card-afford-progress-track">
                  <div 
                    className="card-afford-progress-fill" 
                    style={{ width: `${progressPct}%` }} 
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
