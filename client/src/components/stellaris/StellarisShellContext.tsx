import { createContext, useContext } from "react";

const StellarisShellContext = createContext(false);

export const StellarisShellProvider = StellarisShellContext.Provider;

export function useIsInStellarisShell(): boolean {
  return useContext(StellarisShellContext);
}
