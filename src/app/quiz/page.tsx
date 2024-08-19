'use client'

import 'reflect-metadata';
import {Breadcrumb, Card, Divider, Flex, Image, message, Typography} from "antd";
import {container} from "tsyringe";
import Quiz from "@/entity/Quiz";
import React, {useEffect, useRef} from "react";
import {proxy, useSnapshot} from "valtio";
import QuizRepository from "@/repository/QuizRepository";
import {SmileOutlined} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import COLORS from "@/styles/Color";
import QuizOption from "@/entity/QuizOption";

type StateType = {
    quiz: Quiz
    answer: {
        index: number
        items: {
            id: number,
            title: string,
            amount: string,
        }[]
    }
}

const QUIZ_REPOSITORY = container.resolve(QuizRepository)

export default function Page() {
    const state = useRef<StateType>(proxy({
        quiz: new Quiz(),
        answer: {
            index: 0,
            items: []
        },
    })).current


    useSnapshot(state, {sync: true})

    function getQuiz() {
        QUIZ_REPOSITORY.getQuiz()
            .then((quiz) => state.quiz = quiz)
            .catch((e) => console.log(e))

        state.answer.index = 0
        state.answer.items = []
    }

    function onSubmit(item: QuizOption) {
        if (!item.isAnswer) {
            message.error("틀렸습니다!")
            return
        }

        console.log('state.quiz.getRecipeSize()', state.quiz.getRecipeSize())
        console.log('state.answer.index', state.answer.index)
        if (state.answer.index + 1 === state.quiz.getRecipeSize()) {
            message.success("정답! 다음 레시피로 이동합니다.")
            getQuiz();
        } else {
            message.success("정답!")
            state.answer.items.push(item)
            state.answer.index = state.answer.index + 1
        }
    }

    useEffect(() => {
        getQuiz();
    }, []);

    return <Flex gap={10} vertical>
        <Flex align={'center'} justify={'center'}>
            <Title level={4}><SmileOutlined/> 퀴즈 <SmileOutlined/></Title>
        </Flex>
        <Card>
            <Flex align={'center'} justify={'center'} vertical>
                <Image width={'50%'} src={state.quiz.menu.image} />
                <Typography.Text style={{color: state.quiz.isIce() ? COLORS.ICE : COLORS.HOT}}
                                 strong>{state.quiz.getTemperature()} {state.quiz.menu.title}</Typography.Text>의 레시피를
                맞추어보자
            </Flex>
        </Card>

        <Breadcrumb
            items={[
                {
                    title: state.answer.index + 1,
                },
                {
                    title: state.quiz.getRecipeSize(),
                },
            ]}
        />
        <Flex gap={5} vertical>
            {state.quiz.recipes.items.length > 0 && state.quiz.recipes.items[state.answer.index].map((item, index) =>
                <Card key={index} onClick={() => onSubmit(item)}>
                    <Flex justify={'space-between'}>
                        <Flex>
                            {item.title}
                            <Divider type={'vertical'}/>
                            {item.amount}
                        </Flex>
                    </Flex>
                </Card>
            )}
        </Flex>

        <Divider/>
        <Typography>정답</Typography>
        <Flex gap={5} vertical>
            {state.answer.items.map((answer, index) =>
                <Card key={index}>
                    <Flex justify={'space-between'}>
                        <Flex>
                            {answer.title}
                            <Divider type={'vertical'}/>
                            {answer.amount}
                        </Flex>
                    </Flex>
                </Card>
            )}
        </Flex>
    </Flex>;
};