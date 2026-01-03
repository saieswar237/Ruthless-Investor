
import React from 'react';
import { ReportCardData } from '../types';
import { Gauge, Zap, Copy, DollarSign, Wallet, Target, Users, TrendingUp } from 'lucide-react';

interface ReportCardProps {
  data: ReportCardData;
}

const Metric: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color?: string }> = ({ icon, label, value, color = "text-red-500" }) => (
  <div className="bg-[#1c1c1f] p-4 rounded-xl border border-red-900/20 flex flex-col gap-2">
    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
      {icon}
      {label}
    </div>
    <div className={`text-xl font-black ${color}`}>
      {value}
    </div>
  </div>
);

const ReportCard: React.FC<ReportCardProps> = ({ data }) => {
  const getScoreColor = (score: number) => {
    if (score > 80) return "text-red-400";
    if (score > 50) return "text-red-600";
    return "text-red-800";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
      <Metric 
        icon={<Gauge size={14} />} 
        label="Feasibility" 
        value={`${data.feasibility}%`} 
        color={getScoreColor(data.feasibility)}
      />
      <Metric 
        icon={<Zap size={14} />} 
        label="Innovation" 
        value={`${data.innovationScore}/100`} 
        color={getScoreColor(data.innovationScore)}
      />
      <Metric 
        icon={<Copy size={14} />} 
        label="Replication Rate" 
        value={data.replicationRate} 
        color={data.replicationRate === 'Hard' ? 'text-red-400' : 'text-red-700'}
      />
      <Metric 
        icon={<TrendingUp size={14} />} 
        label="Market Fit" 
        value={`${data.marketFitValue}/10`} 
        color={getScoreColor(data.marketFitValue * 10)}
      />
      <Metric 
        icon={<DollarSign size={14} />} 
        label="Prod. Cost" 
        value={data.estimatedCost} 
      />
      <Metric 
        icon={<Wallet size={14} />} 
        label="MVP Budget" 
        value={data.mvpBudget} 
      />
      <Metric 
        icon={<Target size={14} />} 
        label="Pricing" 
        value={data.pricingStrategy} 
      />
      <Metric 
        icon={<Users size={14} />} 
        label="Competition" 
        value={data.competition} 
      />
    </div>
  );
};

export default ReportCard;
