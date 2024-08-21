'use client'

import 'reflect-metadata'
import {Button, Card, Flex, Image, Input, message, Upload} from "antd";
import React, {useEffect, useRef} from "react";
import {container} from "tsyringe";
import {proxy, useSnapshot} from "valtio";
import Paragraph from "antd/lib/typography/Paragraph";
import COLORS from "@/styles/Color";
import Group from "@/entity/Group";
import GroupRepository from "@/repository/GroupRepository";
import Title from "antd/lib/typography/Title";
import {UnorderedListOutlined, UploadOutlined} from "@ant-design/icons";
import AdminGroupMenuAlignModal from "@/component/admin/group/AdminGroupMenuAlignModal";

const GROUP_REPOSITORY = container.resolve(GroupRepository)

type StateType = {
    groups: Group[]
    groupInput: {
        name: string | null
        image: string | null
    }
    menuAlignModal: {
        group: Group | null
        open: boolean
    }
}

export default function Page() {
    const state = useRef<StateType>(proxy({
        groups: [],
        groupInput: {
            name: null,
            image: null
        },
        menuAlignModal: {
            group: null,
            open: false
        }
    })).current

    useSnapshot(state, {sync: true})

    useEffect(() => {
        GROUP_REPOSITORY.getGroups()
            .then((groups: Group[]) => {
                state.groups = groups
            })
            .catch((e) => {
                console.log(e)
            });
    }, []);

    function saveMenu() {
        if (state.groupInput.name === null || state.groupInput.name.trim().length === 0) {
            message.error("메뉴명을 입력해주세요");
            return;
        }
        if (state.groupInput.image === null) {
            message.error("이미지를 지정해주세요");
            return;
        }
        GROUP_REPOSITORY.save({
            name: state.groupInput.name,
            image: state.groupInput.image
        })
            .then((group: Group) => {
                message.success(`[${group.name}] 그룹이 등록되었습니다.`)
                state.groups.push(group)
                state.groupInput.name = null
                state.groupInput.image = null
            })
            .catch((e) => {
                console.log(e)
            });
    }

    function onUpload(e) {
        if (e.file.status !== 'done' || !e.file.response) {
            return
        }

        if (e.file.status === 'error') {
            message.error(`파일 업로드에 실패하였습니다. ${e.file.response.message}`)
            return
        }

        state.groupInput.image = e.file.response.url;
    }

    function clear() {
        state.groupInput.image = null
    }

    return <>
        <Title level={4}>그룹 관리</Title>
        <Flex gap={5} vertical>
            <Flex gap={5}>
                <Input value={state.groupInput.name} size={'large'}
                       onChange={e => state.groupInput.name = e.target.value}/>
                <Upload
                    method={'POST'}
                    action={'/api/v1/files'}
                    accept="image/*,application/pdf"
                    listType="picture"
                    maxCount={1}
                    onChange={(e) => onUpload(e)}
                    onRemove={clear}
                    progress={{strokeWidth: 2}}
                    showUploadList={false}
                >
                    <Button size={'large'} icon={<UploadOutlined/>}/>
                </Upload>
                <Button size={'large'} onClick={saveMenu} color={COLORS.headerBackground}>등록</Button>
            </Flex>
            {
                state.groupInput.image !== null &&
                <Image
                    alt={'레시피 사진'}
                    src={state.groupInput.image}
                />
            }
            {state.groups.map(group => <Card key={group.id}>
                    <Flex gap={10} vertical>
                        <Flex justify={'space-between'} align={'center'}>
                            <Paragraph>{group.name}</Paragraph>
                            <Flex gap={5}>
                                <Button onClick={() => {
                                    state.menuAlignModal.open = true
                                    state.menuAlignModal.group = group
                                }} icon={<UnorderedListOutlined/>}/>
                                <Image width={'2rem'} alt={'그룹 사진'} src={group.image}/>
                            </Flex>
                        </Flex>
                    </Flex>
                </Card>
            )}
        </Flex>
        <AdminGroupMenuAlignModal onCancel={() => state.menuAlignModal.open = false}
                                  open={state.menuAlignModal.open}
                                  group={state.menuAlignModal.group}/>
    </>;
};