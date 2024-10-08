'use client'

import {Button, Dropdown, Flex, Menu, MenuProps} from "antd";
import React from "react";
import {useRouter} from "next/navigation";
import COLORS from "@/styles/Color";
import {AndroidOutlined, MehOutlined} from "@ant-design/icons";

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
    {key: "group-quiz", label: "그룹퀴즈"},
    {key: "quiz", label: "퀴즈"}
]

export default function Header() {
    function onMenuClick(menu) {
        router.push(`/${menu.key}`)
    }

    const router = useRouter();

    const items: MenuProps['items'] = [
        { key: '1', label: <a target={"_blank"} onClick={() => router.push(`/admin/menu`)}>메뉴</a>  },
        { key: '2', label: <a target={"_blank"} onClick={() => router.push(`/admin/group`)}>그룹</a>  }
    ]

    return <Flex style={headerStyle} justify={'space-between'} align={'center'}>
        <MehOutlined onClick={() => router.push(`/`)} />
        <Flex align={'center'}>
            <Menu
                selectable={false}
                onClick={onMenuClick}
                mode="horizontal"
                items={menus}
                style={{
                    backgroundColor: COLORS.headerBackground,
                    width: '210px'
                }}
            />
            <Dropdown
                menu={{items}}
            >
                <Button
                    onClick={e => e.preventDefault()}
                    icon={<AndroidOutlined/>}
                />
            </Dropdown>
        </Flex>
    </Flex>;
};