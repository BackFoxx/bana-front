'use client'

import 'reflect-metadata';
import {useEffect, useRef} from "react";
import {proxy, useSnapshot} from "valtio";
import {AutoComplete, Button, Flex, Input, message} from "antd";
import styled from "@emotion/styled";
import COLORS from "@/styles/Color";
import {container} from "tsyringe";
import MenuRepository from "@/repository/MenuRepository";
import AutoSearchResult from "@/entity/AutoSearchResult";
import RecipeItemsCard from "@/component/RecipeItemsCard";
import TopSearchMenuCard from "@/component/TopSearchMenuCard";

type StateType = {
    keyword: string
    autoSearchKeywords: AutoSearchResult[]
    menuId: number | null
}

const MENU_REPOSITORY = container.resolve(MenuRepository)

const SearchButton = styled(Button)`
    background-color: ${COLORS.headerBackground};
    border-color: ${COLORS.headerBackground};
`

const SearchInput = styled(AutoComplete)`
    border-color: ${COLORS.headerBackground};
    width: 100%;
`

export default function Page() {
    const state = useRef<StateType>(proxy({
        keyword: "",
        autoSearchKeywords: [],
        menuId: null
    })).current

    useSnapshot(state, {sync: true})

    useEffect(() => {
        if (state.keyword.trim().length < 1) {
            return
        }
        MENU_REPOSITORY.autoSearch(state.keyword)
            .then((keywords: AutoSearchResult[]) => {
                state.autoSearchKeywords = keywords
            })
            .catch((e) => {
                console.log(e)
            });
    }, [state.keyword]);

    function getOptions() {
        return state.autoSearchKeywords.map(searchKeyword => ({
            label: searchKeyword.title,
            value: searchKeyword.title
        }));
    }

    function onSearchSelected(keyword: string) {
        (document.activeElement as HTMLElement).blur();
        state.menuId = state.autoSearchKeywords
            .find(menu => menu.title === keyword)
            ?.id ?? null;
    }

    function onSearchButtonClick(keyword: string) {
        (document.activeElement as HTMLElement).blur();
        state.menuId = state.autoSearchKeywords
            .find(menu => menu.title === keyword)
            ?.id ?? null

        if (!state.menuId) {
            message.info("일치하는 메뉴가 없어요!")
        }
    }

    function clear() {
        state.menuId = null
        state.keyword = ''
        state.autoSearchKeywords = []
    }

    return <>
        <Flex gap={5} vertical>
            <Flex gap={5}>
                <SearchInput
                    onChange={(keyword) => state.keyword = keyword}
                    value={state.keyword}
                    options={getOptions()}
                    onSelect={onSearchSelected}
                >
                    <Input.Search
                        size="large"
                        placeholder="검색어"
                        onSearch={onSearchButtonClick}
                        enterButton
                    />
                </SearchInput>
                <SearchButton
                    size={'large'}
                    onClick={clear}
                >CLEAR</SearchButton>
            </Flex>
            <RecipeItemsCard menuId={state.menuId} />
            {state.menuId === null && <TopSearchMenuCard onMenuClick={(menuId => state.menuId = menuId)} />}
        </Flex>
    </>
};