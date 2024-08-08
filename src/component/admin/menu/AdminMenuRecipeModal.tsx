import {AutoComplete, Button, Card, Divider, Flex, Input, message, Modal, ModalProps} from "antd";
import React, {useEffect, useRef} from "react";
import {proxy, useSnapshot} from "valtio";
import {container} from "tsyringe";
import MenuRecipeRepository from "@/repository/MenuRecipeItemRepository";
import MenuRecipe from "@/entity/MenuRecipe";
import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";
import {DeleteOutlined, DragOutlined} from "@ant-design/icons";
import COLORS from "@/styles/Color";
import styled from "@emotion/styled";

const MENU_RECIPE_REPOSITORY = container.resolve(MenuRecipeRepository)

type PropsType = ModalProps & {
    menuId: number | null
}

type StateType = {
    items: MenuRecipe[]
    recipeNames: string[]
    keyword: string
    amount: string
}

const NameInput = styled(Input)`
    font-size: 16px;
`

const AmountInput = styled(Input)`
    width: 80%;
`

export default function AdminMenuRecipeModal(props: PropsType) {

    const state = useRef<StateType>(proxy({
        items: [],
        recipeNames: [],
        keyword: '',
        amount: ''
    })).current

    useSnapshot(state, {sync: true})

    useEffect(() => {
        if (props.menuId && props.open) {
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
    }, [props.menuId, props.open])

    useEffect(() => {
        MENU_RECIPE_REPOSITORY.getNames(state.keyword)
            .then((names: string[]) => {
                state.recipeNames = names
            })
            .catch((e) => {
                console.log(e)
            });
    }, [state.keyword])

    function reorder(startIndex: number, endIndex: number): MenuRecipe[] {
        const result = Array.from(state.items);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        result.forEach((recipe, index) => recipe.setOrder(index))
        return result;
    }

    function onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        state.items = reorder(
            result.source.index,
            result.destination.index
        )
    }

    function deleteRecipe(recipeId: number) {
        MENU_RECIPE_REPOSITORY.delete(recipeId)
            .then(() => {
                message.success("레시피가 삭제되었습니다.")
                state.items = state.items.filter(recipe => recipe.id !== recipeId);
            })
            .catch((e) => {
                console.log(e)
            });
    }

    function updateRecipe() {
        if (!props.menuId) {
            message.error("MenuId가 없어 레시피를 수정할 수 없습니다.");
            return
        }

        MENU_RECIPE_REPOSITORY.update(props.menuId, state.items)
            .then(() => {
                message.success("레시피가 수정되었습니다.")
                props.onCancel!(false)
            })
            .catch((e) => {
                console.log(e)
            });
    }

    function saveRecipe() {
        if (!props.menuId) {
            message.error("MenuId가 없어 레시피를 저장할 수 없습니다.");
            return
        }

        MENU_RECIPE_REPOSITORY.save(props.menuId, {
            name: state.keyword,
            amount: state.amount
        })
            .then((recipe: MenuRecipe) => {
                message.success("레시피가 등록되었습니다.")
                state.items.push(recipe)
                state.amount = ''
                state.keyword = ''
            })
            .catch((e) => {
                console.log(e)
            });
    }

    function getRecipeNames() {
        return state.recipeNames.map(name => ({
            label: name,
            value: name
        }))
    }

    return <Modal
        {...props}
        title={'메뉴 레시피 관리'}
        onOk={updateRecipe}
        okText={'수정완료'}
        cancelText={'취소'}
    >
        <Flex gap={5} vertical>
            <Flex gap={5}>
                <AutoComplete
                    style={{ width: '100%'}}
                    options={getRecipeNames()}
                    value={state.keyword}
                    onSelect={(keyword) => state.keyword = keyword}
                >
                    <NameInput
                        value={state.keyword}
                        size={'large'}
                        placeholder={'이름'}
                        onChange={e => state.keyword = e.target.value}
                    />
                </AutoComplete>
                <AmountInput value={state.amount} size={'large'} placeholder={'수량'} onChange={e => state.amount = e.target.value}/>
                <Button size={'large'} onClick={saveRecipe} color={COLORS.headerBackground}>등록</Button>
            </Flex>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            <Flex gap={5} vertical>
                                {state.items.map((recipe, index) => (
                                    <Draggable key={recipe.id} draggableId={recipe.id.toString()} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <Card>
                                                    <Flex align={'center'} justify={'space-between'}>
                                                        <Flex gap={10}>
                                                            <DragOutlined style={{color: '#a1a1a1'}}/>
                                                            {recipe.name}
                                                            <Divider type={'vertical'} />
                                                            {recipe.amount}
                                                        </Flex>
                                                        <Button onClick={() => deleteRecipe(recipe.id)} icon={<DeleteOutlined style={{color: 'red'}}/>}/>
                                                    </Flex>
                                                </Card>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Flex>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </Flex>
    </Modal>
};