import { PropsWithChildren } from "react";
import { ThemeProvider } from "./theme";

export function Providers({ children }: PropsWithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
