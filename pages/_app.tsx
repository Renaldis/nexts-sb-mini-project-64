import { ProfileProvider } from "@/context/profileContextProvider";
import Layout from "@/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/components/theme-provider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ProfileProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ProfileProvider>{" "}
    </ThemeProvider>
  );
}
