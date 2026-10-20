import { useEffect, useState } from "react";
import {
  Network,
  type ConnectionStatus,
} from "@capacitor/network";

export function useNetwork() {
  const [networkStatus, setNetworkStatus] =
    useState<ConnectionStatus | null>(null);

  useEffect(() => {
    let listener: { remove: () => Promise<void> } | undefined;

    const initializeNetwork = async () => {
      const status = await Network.getStatus();

      setNetworkStatus(status);

      listener = await Network.addListener(
        "networkStatusChange",
        (status) => {
          setNetworkStatus(status);
        }
      );
    };

    initializeNetwork();

    return () => {
      listener?.remove();
    };
  }, []);

  return {
    connected: networkStatus?.connected ?? false,
    connectionType: networkStatus?.connectionType ?? "unknown",
  };
}