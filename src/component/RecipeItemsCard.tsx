import {Button, Card, Divider, Flex} from "antd";
import {FileImageOutlined} from "@ant-design/icons";
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
    items: MenuRecipe[]
}

const ImageButton = styled(Button)`
    border-radius: '30%'
`

const MENU_RECIPE_REPOSITORY = container.resolve(MenuRecipeRepository)

export default function RecipeItemsCard(props: PropsType) {
    const state = useRef<StateType>(proxy({
        imageModal: false,
        items: [],
    })).current

    useSnapshot(state, {sync: true})

    useEffect(() => {
        if (props.menuId) {
            MENU_RECIPE_REPOSITORY.getItems(props.menuId, "ICE")
                .then((items: MenuRecipe[]) => {
                    state.items = items
                })
                .catch((e) => {
                    console.log(e)
                });
        } else {
            state.items = []
        }
    }, [props.menuId])

    return (
        <>
            {state.items.map(item => <Card key={item.id}>
                    <Flex justify={'space-between'}>
                        <Flex>
                            {item.name}
                            <Divider type="vertical"/>
                            {item.amount}
                        </Flex>
                        <ImageButton onClick={() => state.imageModal = true} icon={<FileImageOutlined/>}/>
                    </Flex>
                    <RecipeItemImageModal imagePath={item.imagePath} onCancel={() => state.imageModal = false} open={state.imageModal}/>
                </Card>
            )}
        </>
    );
};