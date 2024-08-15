'use client'

import 'reflect-metadata';
import {AutoComplete, Button, Card, Divider, Flex, Input, message, Typography} from "antd";
import {container} from "tsyringe";
import Quiz from "@/entity/Quiz";
import React, {useEffect, useRef} from "react";
import {proxy, useSnapshot} from "valtio";
import QuizRepository from "@/repository/QuizRepository";
import {CheckCircleOutlined, DeleteOutlined, DownCircleOutlined, DragOutlined, SmileOutlined} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import COLORS from "@/styles/Color";
import styled from "@emotion/styled";
import MenuRecipeRepository from "@/repository/MenuRecipeItemRepository";
import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";

type StateType = {
    quiz: Quiz
    answerInput: {
        title: string
        amount: string
    }
    options: {
        recipeTitles: string[]
        amounts: string[]
    }
    answers: {
        title: string,
        amount: string
    }[]
}

const NameInput = styled(Input)`
    font-size: 16px;
`

const AmountInput = styled(Input)`
    width: 80%;
`

const QUIZ_REPOSITORY = container.resolve(QuizRepository)
const MENU_RECIPE_REPOSITORY = container.resolve(MenuRecipeRepository)

export default function Page() {
    const state = useRef<StateType>(proxy({
        quiz: new Quiz(),
        answerInput: {
            title: '',
            amount: ''
        },
        options: {
            recipeTitles: [],
            amounts: []
        },
        answers: []
    })).current

    function getRecipeNames() {
        return state.options.recipeTitles
            .filter(title => state.answerInput.title.length > 0 ? title.startsWith(state.answerInput.title) : true)
            .map(name => ({
                label: name,
                value: name
            }));
    }

    function getRecipeAmounts() {
        return state.options.amounts
            .filter(amount => state.answerInput.amount.length > 0 ? amount.startsWith(state.answerInput.amount) : true)
            .map(name => ({
                label: name,
                value: name
            }));
    }

    useSnapshot(state, {sync: true})

    function getQuiz() {
        QUIZ_REPOSITORY.getQuiz()
            .then((quiz) => state.quiz = quiz)
            .catch((e) => console.log(e))

        state.answers = []
    }

    useEffect(() => {
        getQuiz();

        MENU_RECIPE_REPOSITORY.getNames(state.answerInput.title)
            .then((names: string[]) => {
                state.options.recipeTitles = names
            })
            .catch((e) => {
                console.log(e)
            });

        MENU_RECIPE_REPOSITORY.getAmounts(state.answerInput.amount)
            .then((amounts: string[]) => {
                state.options.amounts = amounts
            })
            .catch((e) => {
                console.log(e)
            });
    }, []);

    function addAnswer() {
        state.answers.push({
            title: state.answerInput.title,
            amount: state.answerInput.amount
        })
        state.answerInput = {}
    }

    function submitAnswer() {
        console.log('?')

        const result = state.quiz.submit(state.answers);
        if (result.isCorrect) {
            message.success("축하합니다! 정답입니다")
            getQuiz()
            return
        }
        if (!result.isCorrect && result.wrongAnswers.length === 0) {
            message.error(result.message)
            return;
        }
        message.error(`오답입니다! 틀린 레시피 : ${result.wrongAnswers.map(answer => answer.title).join(', ')}`)
    }

    function onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        state.answers = reorder(
            result.source.index,
            result.destination.index
        )

        function reorder(startIndex: number, endIndex: number) {
            const result = Array.from(state.answers);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            return result;
        }
    }

    return <Flex gap={10} vertical>
        <Flex align={'center'} justify={'center'}>
            <Title level={4}><SmileOutlined/> 퀴즈 <SmileOutlined/></Title>
        </Flex>
        <Card>
            <Flex align={'center'} justify={'center'}>
                <Typography.Text style={{color: state.quiz.isIce() ? COLORS.ICE : COLORS.HOT}}
                                 strong>{state.quiz.getTemperature()} {state.quiz.menu.title}</Typography.Text>의 레시피를
                맞추어보자
            </Flex>
        </Card>

        <Flex gap={5}>
            <AutoComplete
                style={{width: '100%'}}
                options={getRecipeNames()}
                value={state.answerInput.title}
                onSelect={(keyword) => state.answerInput.title = keyword}
            >
                <NameInput
                    value={state.answerInput.title}
                    size={'large'}
                    placeholder={'이름'}
                    onChange={e => state.answerInput.title = e.target.value}
                />
            </AutoComplete>
            <AutoComplete
                style={{width: '100%'}}
                options={getRecipeAmounts()}
                value={state.answerInput.amount}
                onSelect={(keyword) => state.answerInput.amount = keyword}
            >
                <AmountInput value={state.answerInput.amount} size={'large'} placeholder={'수량'}
                             onChange={e => state.answerInput.amount = e.target.value}/>
            </AutoComplete>
            <Button size={'large'} onClick={addAnswer} color={COLORS.headerBackground}><DownCircleOutlined/></Button>
        </Flex>

        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        <Flex gap={5} vertical>
                            {state.answers.map((answer, index) =>
                                <Draggable key={index} draggableId={index.toString()} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Card key={index}>
                                                <DragOutlined style={{color: '#a1a1a1'}}/>
                                                <Flex justify={'space-between'}>
                                                    <Flex>
                                                        {answer.title}
                                                        <Divider type={'vertical'}/>
                                                        {answer.amount}
                                                    </Flex>
                                                    <Button
                                                        onClick={() => state.answers = state.answers.filter(a => a !== answer)}
                                                        icon={<DeleteOutlined style={{color: 'red'}}/>}/>
                                                </Flex>
                                            </Card>
                                        </div>
                                    )}
                                </Draggable>
                            )}
                            {provided.placeholder}
                        </Flex>
                    </div>
                )}
            </Droppable>
        </DragDropContext>

        <Flex justify={'right'}>
            <Button onClick={submitAnswer}><CheckCircleOutlined style={{color: '#3dde00'}}/> 제출!</Button>
        </Flex>
    </Flex>;
};