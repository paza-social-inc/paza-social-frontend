interface ERIBadgeProps {
  score: number;
}

export function ERIBadge({ score }: ERIBadgeProps) {
  let className = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-mono font-semibold ';
  if (score >= 80) {
    className += 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  } else if (score >= 50) {
    className += 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  } else {
    className += 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  }
  return <span className={className}>{score}</span>;
}