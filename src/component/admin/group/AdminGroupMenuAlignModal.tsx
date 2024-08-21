import React, {useEffect, useRef} from "react";
import {proxy, useSnapshot} from "valtio";
import {AutoComplete, Button, Card, Divider, Flex, Input, message, Modal, ModalProps} from "antd";
import COLORS from "@/styles/Color";
import {DeleteOutlined} from "@ant-design/icons";
import Group from "@/entity/Group";
import {container} from "tsyringe";
import GroupRepository from "@/repository/GroupRepository";
import MenuRepository from "@/repository/MenuRepository";
import Menu from "@/entity/Menu";
import styled from "@emotion/styled";

type PropsType = ModalProps & {
    group: Group | null
}

type StateType = {
    menuOptions: Menu[]
    menus: Menu[]
    menu: string | null
}

const NameInput = styled(Input)`
    font-size: 16px;
`

const GROUP_REPOSITORY = container.resolve(GroupRepository)
const MENU_REPOSITORY = container.resolve(MenuRepository)

export default function AdminGroupMenuAlignModal(props: PropsType) {
    const state = useRef<StateType>(proxy({
        menuOptions: [],
        menus: [],
        menu: null
    })).current

    useSnapshot(state, {sync: true})

    useEffect(() => {
        if (!props.open || props.group === null) {
            return
        }

        MENU_REPOSITORY.getMenus()
            .then((menus: Menu[]) => {
                state.menuOptions = menus
            })
            .catch((e) => {
                console.log(e)
            });

        GROUP_REPOSITORY.getMenusByGroupId(props.group.id)
            .then((menus: Menu[]) => {
                state.menus = menus
            })
            .catch((e) => {
                console.log(e)
            });
    }, [props.open])

    function getMenuNames() {
        return state.menuOptions
            .filter(menu => menu.title.includes(state.menu ?? ''))
            .map(menu => ({
                label: menu.title,
                value: menu.title
            }));
    }

    function saveMenu() {
        let menu = state.menuOptions.find(menu => menu.title === state.menu);
        if (menu === undefined) {
            message.error("존재하지 않는 메뉴명입니다.")
            return
        }
        if (!props.group) {
            message.error("그룹이 존재하지 않습니다.")
            return
        }
        GROUP_REPOSITORY.alignMenuToGroup(menu.id, props.group.id)
            .then(() => {
                state.menus.push(menu!)
                state.menu = null
            })
            .catch((e) => {
                console.log(e)
            });
    }

    function deleteKeyword(e: React.MouseEvent<HTMLElement>, menu: number) {

    }

    return <Modal
        {...props}
        title={`${props.group?.name}의 메뉴 관리`}
        footer={null}
    >
        <Flex style={{width: '90%'}} gap={5} vertical>
            <Flex gap={5}>
                <AutoComplete
                    style={{width: '100%'}}
                    options={getMenuNames()}
                    value={state.menu}
                    onSelect={(keyword) => state.menu = keyword}
                >
                    <NameInput
                        value={state.menu}
                        size={'large'}
                        placeholder={'이름'}
                        onChange={e => state.menu = e.target.value}
                    />
                </AutoComplete>
                <Button size={'large'} onClick={saveMenu} color={COLORS.headerBackground}>등록</Button>
            </Flex>
            {state.menus.map(menu => <Card key={menu.id}>
                <Flex justify={'space-between'}>
                    {menu.title}
                    <Divider type="vertical"/>
                    <Button onClick={(e) => deleteKeyword(e, menu.id)} icon={<DeleteOutlined style={{color: 'red'}}/>}/>
                </Flex>
            </Card>)}
        </Flex>
    </Modal>
};