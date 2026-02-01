// src/components/pages/dashboard/header/NotificationBadge.tsx

interface NotificationBadgeProps {
  count: number;
  max?: number;
}

const NotificationBadge = ({ count, max = 99 }: NotificationBadgeProps) => {
  if (count === 0) return null;

  const displayCount = count > max ? `${max}+` : count;

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1 animate-pulse">
      {displayCount}
    </span>
  );
};

export default NotificationBadge;