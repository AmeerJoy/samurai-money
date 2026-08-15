import React from 'react';
import { MarketNewsItem, MarketEvent } from '../../types/trading';
import { TRADING_ASSETS } from '../../data/tradingAssets';
import { Newspaper, Sparkles, Clock } from 'lucide-react';

interface MarketNewsViewProps {
  news: MarketNewsItem[];
  events: MarketEvent[];
  onSelectAsset?: (assetId: string) => void;
}

export const MarketNewsView: React.FC<MarketNewsViewProps> = ({
  news,
  events,
  onSelectAsset
}) => {
  return (
    <div className="market-news-view-container">
      {/* Active Events Banner if any */}
      {events.length > 0 && (
        <div className="active-events-section">
          <div className="events-header">
            <Sparkles size={16} color="#F59E0B" />
            <span>ACTIVE PROVINCIAL EVENTS</span>
          </div>

          <div className="events-list">
            {events.map(event => (
              <div key={event.id} className="active-event-card">
                <div className="event-main">
                  <span className="event-title">{event.name}</span>
                  <p className="event-desc">{event.description}</p>
                </div>
                <div className="event-badge">
                  <span>{event.multiplier > 1 ? `+${Math.round((event.multiplier - 1) * 100)}%` : `-${Math.round((1 - event.multiplier) * 100)}%`} Demand</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market News Dispatches */}
      <div className="news-feed-header">
        <Newspaper size={16} color="#D20A2E" />
        <span>PROVINCIAL TRADE DISPATCHES</span>
      </div>

      <div className="news-feed-list">
        {news.map(item => {
          const asset = item.affectedAssetId ? TRADING_ASSETS.find(a => a.id === item.affectedAssetId) : null;
          const date = new Date(item.timestamp);
          const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <div 
              key={item.id} 
              className={`news-item-card ${item.isPositive ? 'news-bullish' : 'news-bearish'}`}
              onClick={() => asset && onSelectAsset && onSelectAsset(asset.id)}
              style={{ cursor: asset ? 'pointer' : 'default' }}
            >
              <div className="news-top-meta">
                <div className="news-time-tag">
                  <Clock size={12} />
                  <span>{timeStr}</span>
                </div>

                {asset && (
                  <span className="news-asset-tag">
                    {asset.name}
                    {item.priceImpactPercentage !== undefined && (
                      <span className={`news-impact-badge ${item.isPositive ? 'impact-up' : 'impact-down'}`}>
                        {item.isPositive ? '+' : ''}{item.priceImpactPercentage}%
                      </span>
                    )}
                  </span>
                )}
              </div>

              <h4 className="news-item-title">{item.title}</h4>
              <p className="news-item-desc">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
