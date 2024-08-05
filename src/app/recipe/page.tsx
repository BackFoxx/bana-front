'use client'

import Search from "antd/lib/input/Search";
import {useRef} from "react";
import {proxy, useSnapshot} from "valtio";
import {Button, Flex, Input} from "antd";
import styled from "@emotion/styled";
import COLORS from "@/app/styles/Color";

type StateType = {
    keyword: string
}

const SearchButton = styled(Button)`
    background-color: ${COLORS.headerBackground};
    border-color: ${COLORS.headerBackground};
`

const SearchInput = styled(Input)`
    border-color: ${COLORS.headerBackground};
`

export default function Page() {



    const state = useRef<StateType>(proxy({
        keyword: ""
    })).current

    useSnapshot(state, {sync: true})

    return <>
        <Flex gap={5}>
            <SearchInput
                placeholder="메뉴의 이름 또는 초성을 적어보세요"
                size="large"
            />
            <SearchButton size={'large'}>검색</SearchButton>
        </Flex>
    </>
};