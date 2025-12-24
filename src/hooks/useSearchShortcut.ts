import { useEffect } from 'react';

/**
 * Hook to handle global keyboard shortcut for search (Ctrl+K / Cmd+K)
 */
export function useSearchShortcut(onTrigger: () => void) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check for Ctrl+K (Windows/Linux) or Cmd+K (Mac)
            if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                // Prevent default browser behavior
                event.preventDefault();

                // Don't trigger if user is typing in an input/textarea
                const target = event.target as HTMLElement;
                const isInputField =
                    target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.isContentEditable;

                if (!isInputField) {
                    onTrigger();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onTrigger]);
}
