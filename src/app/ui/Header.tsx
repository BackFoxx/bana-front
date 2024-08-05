'use client'

import {Flex, Menu} from "antd";
import React from "react";
import {useRouter} from "next/navigation";
import Paragraph from "antd/lib/typography/Paragraph";
import COLORS from "@/app/styles/Color";

const headerStyle: React.CSSProperties = {
    height: 50,
    paddingInline: 10,
    lineHeight: '64px',
    backgroundColor: COLORS.headerBackground,
    marginBottom: '30px',
    display: 'flex',
    alignItems: 'center'
};

const menus = [
    {key: "recipe", label: "레시피"},
    {key: "quiz", label: "퀴즈"}
]

export default function Header() {
    function onMenuClick(menu) {
        router.push(`/${menu.key}`)
    }

    const router = useRouter();

    return <Flex  style={headerStyle} justify={'end'}>
        <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
            <Paragraph strong>레시피창고</Paragraph>
        </div>
        <Menu
            onClick={onMenuClick}
            mode="horizontal"
            items={menus}
            style={{
                marginLeft: 'auto',
                backgroundColor: COLORS.headerBackground
            }}
        />
    </Flex>
};