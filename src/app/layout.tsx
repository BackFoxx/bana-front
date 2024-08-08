import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Header from "@/component/Header";
import {Content} from "antd/lib/layout/layout";
import {ConfigProvider} from "antd";
import COLORS from "@/styles/Color";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: COLORS.headerBackground,
                }
            }}
        >
            <Header/>
            <Content style={{
                width: '80%',
                margin: 'auto'
            }}>
                {children}
            </Content>
        </ConfigProvider>
        </body>
        </html>
    );
}
