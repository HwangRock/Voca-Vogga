import "./globals.css";
import Header from "./components/Header";

export const metadata = {
  title: "HwangRock Voca Test",
  description: "영단어 테스트 앱",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
