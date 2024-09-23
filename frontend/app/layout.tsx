import Providers from "./provider";
import { FC } from "react";

export const metadata = {
  title: "rusty-book-manager",
  description: "Rust蔵書管理アプリ（『RustによるWebアプリケーション開発』）",
};

const RootLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
