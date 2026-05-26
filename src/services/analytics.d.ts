export function initGA(): void
export function trackPageView(path: string): void
export function trackEvent(category: string, action: string, label?: string): void

declare global {
	interface Window {
		dataLayer?: unknown[]
		gtag?: (...args: unknown[]) => void
	}
}
