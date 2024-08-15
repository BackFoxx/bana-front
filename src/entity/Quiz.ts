import QuizMenu from "@/entity/QuizMenu";
import {Type} from "class-transformer";
import QuizRecipe from "@/entity/QuizRecipe";

export default class Quiz {
    @Type(() => QuizMenu)
    public menu = new QuizMenu();

    @Type(() => QuizRecipe)
    public recipes = new QuizRecipe();

    public submit(answers: { title: string; amount: string }[]): {
        isCorrect: boolean
        message: string,
        wrongAnswers: { title: string; amount: string }[]
    } {
        return this.recipes.submit(answers);
    }

    public getTemperature() {
        return this.recipes.temperature;
    }

    public isIce() {
        return this.getTemperature() === 'ICE';
    }
};

