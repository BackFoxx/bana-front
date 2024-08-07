import {Button, Card, Divider, Flex, Input, message, Modal, ModalProps} from "antd";
import React, {useEffect, useRef} from "react";
import {container} from "tsyringe";
import MenuRepository from "@/repository/MenuRepository";
import {proxy, useSnapshot} from "valtio";
import {DeleteOutlined} from "@ant-design/icons";
import MenuKeyword from "@/entity/MenuKeyword";
import COLORS from "@/styles/Color";

type PropsType = ModalProps & {
    menuId: number | null
}

type StateType = {
    keywords: MenuKeyword[]
    keyword: string
}

const MENU_REPOSITORY = container.resolve(MenuRepository)

export default function AdminMenuKeywordModal(props: PropsType) {
    const state = useRef<StateType>(proxy({
        keywords: [],
        keyword: ""
    })).current

    useSnapshot(state, {sync: true})

    useEffect(() => {
        if (!props.open) {
            return
        }

        if (!props.menuId) {
            state.keywords = []
            return;
        }

        state.keyword = ''
        MENU_REPOSITORY.getKeywords(props.menuId)
            .then((keywords: MenuKeyword[]) => {
                state.keywords = keywords
            })
            .catch((e) => {
                console.log(e)
            });
    }, [props.open])

    function deleteKeyword(e, keywordId: number) {
        MENU_REPOSITORY.deleteKeyword(keywordId)
            .then(() => {
                message.success("키워드가 삭제되었습니다.")
                props.onCancel!(false)
            })
            .catch((e) => {
                console.log(e)
            });
    }

    function saveKeyword() {
        if (!props.menuId) {
            message.error("MenuId가 없어 키워드 등록이 불가합니다.")
            return
        }
        MENU_REPOSITORY.saveKeyword(props.menuId, state.keyword)
            .then((keyword: MenuKeyword) => {
                message.success("키워드가 등록되었습니다.")
                state.keywords.push(keyword)
            })
            .catch((e) => {
                console.log(e)
            });
    }

    return <Modal
        {...props}
        title={'메뉴 검색 키워드 관리'}
        footer={null}
    >
        <Flex style={{width: '90%'}} gap={5} vertical>
            <Flex gap={5}>
                <Input value={state.keyword} size={'large'} onChange={e => state.keyword = e.target.value} />
                <Button size={'large'} onClick={saveKeyword} color={COLORS.headerBackground}>등록</Button>
            </Flex>
            {state.keywords.map(keyword => <Card key={keyword.id}>
                <Flex justify={'space-between'}>
                    {keyword.keyword}
                    <Divider type="vertical"/>
                    <Button onClick={(e) => deleteKeyword(e, keyword.id)} icon={<DeleteOutlined color={'red'}/>}/>
                </Flex>
            </Card>)}
        </Flex>
    </Modal>
};