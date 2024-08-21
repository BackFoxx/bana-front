'use client'

import 'reflect-metadata';
import {Card, Flex} from "antd";
import Title from "antd/lib/typography/Title";
import {SmileOutlined} from "@ant-design/icons";
import React, {useEffect, useRef} from "react";
import Group from "@/entity/Group";
import {proxy, useSnapshot} from "valtio";
import {container} from "tsyringe";
import GroupRepository from "@/repository/GroupRepository";
import {useRouter} from "next/navigation";

type StateType = {
    groups: Group[]
};

const GROUP_REPOSITORY = container.resolve(GroupRepository)

export default function Page() {
    const state = useRef<StateType>(proxy({
        groups: []
    })).current

    useSnapshot(state, {sync: true})

    const router = useRouter();

    useEffect(() => {
        GROUP_REPOSITORY.getGroups()
            .then((groups: Group[]) => {
                state.groups = groups
            })
            .catch((e) => {
                console.log(e)
            });
    }, []);

    return <Flex gap={10} vertical>
        <Flex align={'center'} justify={'center'}>
            <Title level={4}><SmileOutlined/> 그룹퀴즈 <SmileOutlined/></Title>
        </Flex>
        <Flex align={'center'} justify={'center'} gap={10} wrap>
            {state.groups.map(group =>
                <Card key={group.id}
                      hoverable
                      style={{
                          width: '150px',
                      }}
                      cover={<img style={{height: '150px', width: '150px'}} alt="example" src={group.image}/>}
                      onClick={() => router.replace(`/quiz?groupId=${group.id}`)}
                >
                    {group.name}
                </Card>)}
        </Flex>
    </Flex>;
};