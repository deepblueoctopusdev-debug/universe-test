export function ViewportPanelSystem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 min-w-0 overflow-hidden" data-testid="stellaris-viewport">
      {children}
    </div>
  );
}
