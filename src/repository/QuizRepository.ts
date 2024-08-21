import AxiosClient from "@/repository/AxiosClient";
import {singleton} from "tsyringe";
import Quiz from "@/entity/Quiz";

@singleton()
export default class QuizRepository {
    private readonly axiosClient: AxiosClient

    public constructor(axiosClient: AxiosClient) {
        this.axiosClient = axiosClient;
    }

    public getQuiz(groupId: number | null = null): Promise<Quiz> {
        const params = groupId ? {groupId: groupId} : null;
        return this.axiosClient.get(`/api/v1/quiz/problem`, params, Quiz);
    }
};