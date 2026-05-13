import { User as UserIcon, Shield, Mail, MapPin, Calendar, MoreHorizontal } from 'lucide-react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';

interface UserCardProps {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    city?: string;
    created_at: string;
  };
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <Card className="group">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-black border border-neutral-100">
            <UserIcon size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-bold text-black tracking-tight">{user.name}</h3>
            <Badge 
              variant={user.role === 'admin' ? 'amber' : 'neutral'}
              icon={<Shield size={10} />}
            >
              {user.role}
            </Badge>
          </div>
        </div>
        <button className="p-2 text-neutral-300 hover:text-black transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <Mail size={14} className="text-neutral-300" />
          {user.email}
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <MapPin size={14} className="text-neutral-300" />
          {user.city || 'Not specified'}
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <Calendar size={14} className="text-neutral-300" />
          Joined {new Date(user.created_at).toLocaleDateString()}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-50 flex gap-2">
        <button className="flex-grow py-2.5 bg-neutral-50 hover:bg-black hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300">
          Edit User
        </button>
        <button className="px-4 py-2.5 bg-neutral-50 hover:bg-red-50 hover:text-red-600 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300">
          Restrict
        </button>
      </div>
    </Card>
  );
}
