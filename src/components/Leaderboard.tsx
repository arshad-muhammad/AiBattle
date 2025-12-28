import React, { useMemo } from 'react';
import { BarChart, Trophy, Zap, Activity, X } from 'lucide-react';
import { ChatSession, ModelResponse } from '../types';
import { BATTLE_MODELS } from '../services/groq';

interface LeaderboardProps {
  sessions: ChatSession[];
  onClose: () => void;
}

interface ModelStats {
  id: string;
  name: string;
  battles: number;
  wins: number;
  winRate: number;
  totalLatency: number;
  avgLatency: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ sessions, onClose }) => {
  const stats = useMemo(() => {
    const modelStats: Record<string, ModelStats> = {};

    // Initialize stats for all models
    BATTLE_MODELS.forEach(model => {
      modelStats[model.id] = {
        id: model.id,
        name: model.displayName,
        battles: 0,
        wins: 0,
        winRate: 0,
        totalLatency: 0,
        avgLatency: 0
      };
    });

    sessions.forEach(session => {
      session.messages.forEach(msg => {
        if (msg.role === 'model' && msg.modelResponses && msg.modelResponses.length > 1) {
          // It was a battle (more than 1 response)
          let hasWinner = false;
          
          msg.modelResponses.forEach(resp => {
            if (modelStats[resp.modelId]) {
              modelStats[resp.modelId].battles += 1;
              if (resp.latency) {
                modelStats[resp.modelId].totalLatency += resp.latency;
              }
              if (resp.isWinner) {
                modelStats[resp.modelId].wins += 1;
                hasWinner = true;
              }
            }
          });
        }
      });
    });

    // Calculate averages
    return Object.values(modelStats).map(stat => ({
      ...stat,
      winRate: stat.battles > 0 ? (stat.wins / stat.battles) * 100 : 0,
      avgLatency: stat.battles > 0 ? stat.totalLatency / stat.battles : 0
    })).sort((a, b) => b.winRate - a.winRate || b.wins - a.wins); // Sort by Win Rate then Wins

  }, [sessions]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1e1e1e] border border-[#333] w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        <div className="flex items-center justify-between p-6 border-b border-[#333]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Trophy className="text-yellow-500" size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white">Your Personal Leaderboard</h2>
                <p className="text-sm text-gray-400">Based on your battle history and votes</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 hover:bg-[#333] rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="grid gap-4">
            {stats.map((model, index) => (
              <div 
                key={model.id}
                className="bg-[#141414] border border-[#333] rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 md:gap-8 hover:border-gray-600 transition-colors"
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-12 h-12 shrink-0 font-bold text-2xl text-gray-600">
                  {index === 0 ? <span className="text-yellow-400">#1</span> : 
                   index === 1 ? <span className="text-gray-300">#2</span> :
                   index === 2 ? <span className="text-amber-600">#3</span> : 
                   `#${index + 1}`}
                </div>

                {/* Name */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-bold text-white">{model.name}</h3>
                  <p className="text-xs text-gray-500">{model.id}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 md:gap-12 w-full md:w-auto">
                    
                    {/* Win Rate */}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5 text-yellow-500 mb-1">
                            <Trophy size={16} />
                            <span className="text-xs font-medium uppercase tracking-wider">Win Rate</span>
                        </div>
                        <span className="text-xl font-bold text-white">{model.winRate.toFixed(1)}%</span>
                        <span className="text-xs text-gray-500">{model.wins} wins / {model.battles} battles</span>
                    </div>

                    {/* Speed */}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5 text-blue-400 mb-1">
                            <Zap size={16} />
                            <span className="text-xs font-medium uppercase tracking-wider">Avg Speed</span>
                        </div>
                        <span className="text-xl font-bold text-white">{(model.avgLatency / 1000).toFixed(2)}s</span>
                        <span className="text-xs text-gray-500">latency</span>
                    </div>

                    {/* Activity */}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5 text-green-400 mb-1">
                            <Activity size={16} />
                            <span className="text-xs font-medium uppercase tracking-wider">Matches</span>
                        </div>
                        <span className="text-xl font-bold text-white">{model.battles}</span>
                        <span className="text-xs text-gray-500">total</span>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

