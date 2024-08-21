import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Header from "@/component/Header";
import {Content} from "antd/lib/layout/layout";
import COLORS from "@/styles/Color";
import {ConfigProvider} from "antd";
import {Suspense} from "react";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "바나 레시피",
    description: "레시피 쉽게 보려고 만든 사이트",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <Suspense>
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
        </Suspense>
        </body>
        </html>
    );
}
