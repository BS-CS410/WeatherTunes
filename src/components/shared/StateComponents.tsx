import { STATE_STYLES } from "@/lib/sharedStyles";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  className = "",
}: LoadingStateProps) {
  return (
    <div className={`${STATE_STYLES.loading} ${className}`}>
      <p className={STATE_STYLES.loadingText}>{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  title: string;
  message?: string;
  className?: string;
}

export function ErrorState({
  title,
  message,
  className = "",
}: ErrorStateProps) {
  return (
    <div className={`${STATE_STYLES.error} ${className}`}>
      <p className={STATE_STYLES.errorText}>{title}</p>
      {message && <p className={STATE_STYLES.errorSubtext}>{message}</p>}
    </div>
  );
}
