import { useState, useEffect } from "react";

export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setIsClient(true);
  }, []);

  return isClient;
}
