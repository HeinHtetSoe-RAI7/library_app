// app/layout.js  (Server Component)
import RootLayout from "./RootLayout";

export const metadata = {
  title: "Library App",
  description: "A Next.js + FastAPI library project",
};

export default function Layout({ children }) {
  return <RootLayout>{children}</RootLayout>;
}
