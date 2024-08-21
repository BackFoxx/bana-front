'use client'

import 'reflect-metadata'
import {Button, Card, Flex, Input, message} from "antd";
import React, {useEffect, useRef} from "react";
import Menu from "@/entity/Menu";
import {container} from "tsyringe";
import MenuRepository from "@/repository/MenuRepository";
import {proxy, useSnapshot} from "valtio";
import Paragraph from "antd/lib/typography/Paragraph";
import {DeleteOutlined, ExperimentOutlined, FileImageOutlined, SearchOutlined} from "@ant-design/icons";
import AdminMenuKeywordModal from "@/component/admin/menu/AdminMenuKeywordModal";
import COLORS from "@/styles/Color";
import AdminMenuRecipeModal from "@/component/admin/menu/AdminMenuRecipeModal";
import MenuImageCard from "@/component/admin/menu/MenuImageCard";
import Title from "antd/lib/typography/Title";

const MENU_REPOSITORY = container.resolve(MenuRepository)

type StateType = {
    menus: Menu[]
    menu: {
        id: number | null
        name: string
        imageCard: boolean
    }
    modal: {
        keywordModal: boolean
        recipeModal: boolean
        menuId: number | null
        menuName: string | null
    }
}

export default function Page() {
    const state = useRef<StateType>(proxy({
        menus: [],
        menu: {
            id: null,
            name: '',
            imageCard: false
        },
        modal: {
            keywordModal: false,
            recipeModal: false,
            menuId: null,
            menuName: null
        }
    })).current

    useSnapshot(state, {sync: true})

    useEffect(() => {
        MENU_REPOSITORY.getMenus()
            .then((menus: Menu[]) => {
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

    function switchImageCard(menuId: number) {
        if (state.menu.id === menuId) {
            state.menu.imageCard = !state.menu.imageCard
            return
        }
        state.menu.imageCard = true
        state.menu.id = menuId;
    }

    function saveImage(menu: Menu, url: string) {
        MENU_REPOSITORY.updateMenuImage(state.menu.id!, url)
            .then(() => {
                message.success(`이미지 수정이 완료되었습니다.`)
                menu.image = url
                state.menu.imageCard = false
            })
            .catch((e) => {
                console.log(e)
            });
    }

    return <>
        <Title level={4}>메뉴 관리</Title>
        <Flex gap={5} vertical>
            <Flex gap={5}>
                <Input value={state.menu.name} size={'large'} onChange={e => state.menu.name = e.target.value}/>
                <Button size={'large'} onClick={saveMenu} color={COLORS.headerBackground}>등록</Button>
            </Flex>
            {state.menus.map(menu => <Card key={menu.id}>
                    <Flex gap={10} vertical>
                        <Flex justify={'space-between'}>
                            <Paragraph>{menu.title}</Paragraph>
                            <Flex gap={5}>
                                <Button icon={<FileImageOutlined/>} onClick={() => switchImageCard(menu.id)}/>
                                <Button onClick={() => {
                                    state.modal.keywordModal = true
                                    state.modal.menuId = menu.id
                                    state.modal.menuName = menu.title
                                }} icon={<SearchOutlined/>}/>
                                <Button onClick={() => {
                                    state.modal.recipeModal = true
                                    state.modal.menuId = menu.id
                                    state.modal.menuName = menu.title
                                }} icon={<ExperimentOutlined/>}/>
                                <Button onClick={() => deleteMenu(menu.id)}
                                        icon={<DeleteOutlined style={{color: 'red'}}/>}/>
                            </Flex>
                        </Flex>
                        {state.menu.id === menu.id && state.menu.imageCard && <MenuImageCard onSave={(url) => saveImage(menu, url)} imagePath={menu.image}/>}
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
            menuName={state.modal.menuName}
            menuId={state.modal.menuId}
        />
    </>;
};