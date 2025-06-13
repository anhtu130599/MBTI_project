// Date utility functions

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - d.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInHours / 24;

  if (diffInHours < 1) {
    return 'Vừa xong';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} giờ trước`;
  } else if (diffInDays < 7) {
    return `${Math.floor(diffInDays)} ngày trước`;
  } else {
    return formatDate(d);
  }
}

export function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime());
} 
