import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useViewportBreakpoint(maxWidth: number) {
  const [matches, setMatches] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const onChange = () => setMatches(mql.matches);

    onChange();
    mql.addEventListener('change', onChange);

    return () => mql.removeEventListener('change', onChange);
  }, [maxWidth]);

  return !!matches;
}

export function useIsMobile() {
  return useViewportBreakpoint(MOBILE_BREAKPOINT - 1);
}
