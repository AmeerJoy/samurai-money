import React from 'react';
import { TradeRecord } from '../../types/trading';
import { formatMoney, formatNumber } from '../../systems/formatting';
import { History, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface TradeHistoryViewProps {
  trades: TradeRecord[];
  numberFormat?: 'standard' | 'scientific';
}

export const TradeHistoryView: React.FC<TradeHistoryViewProps> = ({
  trades,
  numberFormat = 'standard'
}) => {
  if (trades.length === 0) {
    return (
      <div className="trade-history-empty">
        <History size={44} className="empty-history-icon" />
        <h3>No Transaction History</h3>
        <p>Your completed buy and sell transactions will appear here in chronological order.</p>
      </div>
    );
  }

  // Calculate statistics
  const buyTrades = trades.filter(t => t.type === 'BUY');
  const sellTrades = trades.filter(t => t.type === 'SELL');
  const totalRealizedProfit = sellTrades.reduce((acc, t) => acc + (t.profit || 0), 0);
  const winningTrades = sellTrades.filter(t => (t.profit || 0) > 0).length;
  const winRate = sellTrades.length > 0 ? (winningTrades / sellTrades.length) * 100 : 0;

  return (
    <div className="trade-history-container">
      {/* Trading Performance Stats Banner */}
      <div className="history-stats-banner">
        <div className="hstat-box">
          <span className="hstat-label">Total Trades</span>
          <span className="hstat-val">{trades.length}</span>
        </div>
        <div className="hstat-box">
          <span className="hstat-label">Buys / Sells</span>
          <span className="hstat-val">{buyTrades.length} / {sellTrades.length}</span>
        </div>
        <div className="hstat-box">
          <span className="hstat-label">Realized Profit</span>
          <span className={`hstat-val ${totalRealizedProfit >= 0 ? 'text-green' : 'text-crimson'}`}>
            {totalRealizedProfit >= 0 ? '+' : ''}{formatMoney(totalRealizedProfit, numberFormat)}
          </span>
        </div>
        <div className="hstat-box">
          <span className="hstat-label">Win Rate</span>
          <span className="hstat-val">{winRate.toFixed(1)}%</span>
        </div>
      </div>

      {/* Trade Log Table */}
      <div className="history-log-list">
        {trades.slice().reverse().map(trade => {
          const isBuy = trade.type === 'BUY';
          const isProfitable = (trade.profit || 0) >= 0;
          const date = new Date(trade.timestamp);
          const formattedDate = `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} — ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

          return (
            <div key={trade.id} className={`trade-log-row ${isBuy ? 'log-buy' : 'log-sell'}`}>
              <div className="log-type-icon-col">
                <div className={`log-badge-circle ${isBuy ? 'badge-buy' : 'badge-sell'}`}>
                  {isBuy ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </div>
              </div>

              <div className="log-main-col">
                <div className="log-title-row">
                  <span className={`log-action-text ${isBuy ? 'text-buy' : 'text-sell'}`}>
                    {trade.type} {trade.assetName}
                  </span>
                  <span className="log-total-amount">
                    {isBuy ? '-' : '+'}{formatMoney(trade.totalAmount, numberFormat)}
                  </span>
                </div>

                <div className="log-details-row">
                  <span className="log-sub-units">
                    {formatNumber(trade.quantity)} units @ {formatMoney(trade.pricePerUnit, numberFormat)}/unit
                  </span>
                  <span className="log-timestamp">{formattedDate}</span>
                </div>

                {!isBuy && trade.profit !== undefined && (
                  <div className="log-profit-badge-row">
                    <span className={`log-profit-pill ${isProfitable ? 'profit-gain' : 'profit-loss'}`}>
                      {isProfitable ? 'Profit: +' : 'Loss: '}
                      {formatMoney(trade.profit, numberFormat)} 
                      {trade.returnPercentage !== undefined ? ` (${trade.returnPercentage >= 0 ? '+' : ''}${trade.returnPercentage.toFixed(1)}%)` : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
