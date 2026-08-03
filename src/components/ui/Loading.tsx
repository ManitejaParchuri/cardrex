interface LoadingProps {
  label?: string;
}

export function Loading({ label = 'Loading' }: LoadingProps) {
  return (
    <div
      role="status"
      className="flex min-h-32 flex-col items-center justify-center gap-3 text-sm text-violet-100/70"
    >
      <span className="relative block size-10" aria-hidden="true">
        <span className="absolute inset-0 animate-ping rounded-full bg-violet-400/25" />
        <span className="absolute inset-2 animate-spin rounded-full border-2 border-violet-300 border-t-transparent" />
      </span>
      <span>{label}</span>
    </div>
  );
}
