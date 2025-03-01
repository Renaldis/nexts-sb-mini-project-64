import { ProfileProvider } from "@/context/profileContextProvider";
import Layout from "@/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ProfileProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ProfileProvider>
  );
}
