'use client'

import 'reflect-metadata'
import {Button, Card, Flex, Input, message} from "antd";
import React, {useEffect, useRef} from "react";
import Menu from "@/entity/Menu";
import {container} from "tsyringe";
import MenuRepository from "@/repository/MenuRepository";
import {proxy, useSnapshot} from "valtio";
import Paragraph from "antd/lib/typography/Paragraph";
import {DeleteOutlined, ExperimentOutlined, SearchOutlined} from "@ant-design/icons";
import AdminMenuKeywordModal from "@/component/admin/menu/AdminMenuKeywordModal";
import COLORS from "@/styles/Color";
import AdminMenuRecipeModal from "@/component/admin/menu/AdminMenuRecipeModal";

const MENU_REPOSITORY = container.resolve(MenuRepository)

type StateType = {
    menus: Menu[]
    menu: {
        name: string
    }
    modal: {
        keywordModal: boolean
        recipeModal: boolean
        menuId: number | null
    }
}

export default function Page() {
    const state = useRef<StateType>(proxy({
        menus: [],
        menu: {
            name: ''
        },
        modal: {
            keywordModal: false,
            recipeModal: false,
            menuId: null
        }
    })).current

    useSnapshot(state, {sync: true})

    useEffect(() => {
        MENU_REPOSITORY.getMenus()
            .then((menus: Menu[]) => {
                console.log(menus)
                state.menus = menus
            })
            .catch((e) => {
                console.log(e)
            })
    }, []);

    function saveMenu() {
        if (state.menu.name.trim().length === 0) {
            message.error("메뉴명을 입력해주세요");
            return;
        }
        MENU_REPOSITORY.save(state.menu.name)
            .then((menus: Menu) => {
                message.success(`[${state.menu.name}] 메뉴가 등록되었습니다.`)
                state.menus.push(menus)
                state.menu.name = ''
            })
            .catch((e) => {
                console.log(e)
            });
    }

    function deleteMenu(menuId: number) {
        MENU_REPOSITORY.delete(menuId)
            .then(() => {
                message.success(`메뉴가 삭제되었습니다.`)
                state.menus = state.menus.filter(menu => menu.id !== menuId)
            })
            .catch((e) => {
                console.log(e)
            });
    }

    return <>
        <Flex gap={5} vertical>
            <Flex gap={5}>
                <Input value={state.menu.name} size={'large'} onChange={e => state.menu.name = e.target.value}/>
                <Button size={'large'} onClick={saveMenu} color={COLORS.headerBackground}>등록</Button>
            </Flex>
            {state.menus.map(menu => <Card key={menu.id}>
                    <Flex justify={'space-between'}>
                        <Paragraph>{menu.title}</Paragraph>
                        <Flex gap={5}>
                            <Button onClick={() => {
                                state.modal.keywordModal = true
                                state.modal.menuId = menu.id
                            }} icon={<SearchOutlined/>}/>
                            <Button onClick={() => {
                                state.modal.recipeModal = true
                                state.modal.menuId = menu.id
                            }} icon={<ExperimentOutlined/>}/>
                            <Button onClick={() => deleteMenu(menu.id)} icon={<DeleteOutlined style={{color: 'red'}}/>}/>
                        </Flex>
                    </Flex>
                </Card>
            )}
        </Flex>
        <AdminMenuKeywordModal
            open={state.modal.keywordModal}
            onCancel={() => state.modal.keywordModal = false}
            menuId={state.modal.menuId}
        />
        <AdminMenuRecipeModal
            open={state.modal.recipeModal}
            onCancel={() => state.modal.recipeModal = false}
            menuId={state.modal.menuId}
        />
    </>;
};