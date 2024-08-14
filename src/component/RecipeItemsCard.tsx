import {Avatar, Button, Card, Divider, Flex, Segmented} from "antd";
import {FileImageOutlined, MoonOutlined, SunOutlined} from "@ant-design/icons";
import styled from "@emotion/styled";
import RecipeItemImageModal from "@/component/RecipeItemImageModal";
import {useEffect, useRef} from "react";
import {proxy, useSnapshot} from "valtio";
import {container} from "tsyringe";
import MenuRecipeRepository from "@/repository/MenuRecipeItemRepository";
import MenuRecipe from "@/entity/MenuRecipe";

type PropsType = {
    menuId: number | null
}

type StateType = {
    imageModal: boolean
    temperature: string
    items: MenuRecipe[]
}

const ImageButton = styled(Button)`
    border-radius: '30%'
`

const MENU_RECIPE_REPOSITORY = container.resolve(MenuRecipeRepository)

const TEMPERATURE_ICE = 'ICE';
const TEMPERATURE_HOT = 'HOT';

export default function RecipeItemsCard(props: PropsType) {
    const state = useRef<StateType>(proxy({
        imageModal: false,
        temperature: TEMPERATURE_ICE,
        items: [],
    })).current

    useSnapshot(state, {sync: true})

    useEffect(() => {
        if (props.menuId) {
            MENU_RECIPE_REPOSITORY.getItems(props.menuId, state.temperature, true)
                .then((items: MenuRecipe[]) => {
                    state.items = items
                })
                .catch((e) => {
                    console.log(e)
                });
        } else {
            state.items = []
        }
    }, [props.menuId, state.temperature])

    return (
        <>
            <Segmented
                value={state.temperature}
                onChange={(temperature: string) => state.temperature = temperature}
                options={[
                    {
                        label: (
                            <Flex gap={10} align={'center'} justify={'center'}>
                                <Avatar
                                    style={{
                                        backgroundColor: '#5fb6ff',
                                    }}
                                    icon={<MoonOutlined/>}
                                />
                            </Flex>
                        ),
                        value: TEMPERATURE_ICE,
                    },
                    {
                        label: (
                            <Flex gap={10} align={'center'} justify={'center'}>
                                <Avatar
                                    style={{
                                        backgroundColor: '#f56a00',
                                    }}
                                    icon={<SunOutlined/>}
                                />
                            </Flex>
                        ),
                        value: TEMPERATURE_HOT,
                    },
                ]}
                block
            />
            {state.items.map(item => <Card key={item.id}>
                    <Flex justify={'space-between'}>
                        <Flex>
                            {item.name}
                            <Divider type="vertical"/>
                            {item.amount}
                        </Flex>
                        <ImageButton onClick={() => state.imageModal = true} icon={<FileImageOutlined/>}/>
                    </Flex>
                    <RecipeItemImageModal imagePath={item.imagePath} onCancel={() => state.imageModal = false}
                                          open={state.imageModal}/>
                </Card>
            )}
            {props.menuId !== null && state.items.length === 0 && <Card>
                레시피가 등록되지 않았어요! 🤖
            </Card>}
        </>
    );
};