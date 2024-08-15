import Menu from "@/entity/Menu";
import {useEffect, useRef} from "react";
import {proxy, useSnapshot} from "valtio";
import {Card, Divider, Flex, message} from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import {container} from "tsyringe";
import MenuRepository from "@/repository/MenuRepository";

type StateType = {
    menus: Menu[]
}

type PropsType = {
    onMenuClick: (menuId: number) => void
}

const MENU_REPOSITORY = container.resolve(MenuRepository)

export default function TopSearchMenuCard(props: PropsType) {
    const state = useRef<StateType>(proxy({
        menus: []
    })).current

    useSnapshot(state, {sync: true})

    useEffect(() => {
        MENU_REPOSITORY.getMostSearchedMenus()
            .then((menus: Menu[]) => {
                state.menus = menus;
            })
            .catch((e) => {
                console.log(e)
            });
    }, []);

    return <>
        <Card>
            <Paragraph>가장 많이 검색한 메뉴</Paragraph>
            <Flex gap={5} vertical>
                {state.menus.map(menu => <Card key={menu.id} onClick={() => props.onMenuClick(menu.id)}>
                    <Flex align={'center'} justify={'space-between'}>
                        <Paragraph>{menu.title}</Paragraph>
                        <Divider type={'vertical'}/>
                        <Paragraph>{menu.searchCount}회</Paragraph>
                    </Flex>
                </Card>)}
            </Flex>
        </Card>
    </>
};