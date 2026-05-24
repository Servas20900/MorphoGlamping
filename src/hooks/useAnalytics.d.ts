export function useAnalytics(): {
  trackEvent: (category: string, action: string, label?: string) => void
}
