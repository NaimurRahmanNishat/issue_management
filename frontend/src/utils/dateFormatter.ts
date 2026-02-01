// src/utils/dateFormatter.ts

export const formatDistanceToNow = (date: Date, options?: { addSuffix?: boolean }): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return options?.addSuffix ? `${diffInSeconds} seconds ago` : `${diffInSeconds} seconds`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return options?.addSuffix 
      ? `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`
      : `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return options?.addSuffix 
      ? `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
      : `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return options?.addSuffix 
      ? `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
      : `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return options?.addSuffix 
      ? `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`
      : `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'}`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return options?.addSuffix 
    ? `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`
    : `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'}`;
};