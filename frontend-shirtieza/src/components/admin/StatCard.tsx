import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '../ui/Card';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  positive?: boolean;
}

export default function StatCard({ 
  label, 
  value, 
  icon, 
  trend, 
  positive = true 
}: StatCardProps) {
  return (
    <Card className="group">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${
            positive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {trend}
          </div>
        )}
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">{label}</p>
      <p className="text-2xl font-black tracking-tight text-black">{value}</p>
    </Card>
  );
}
