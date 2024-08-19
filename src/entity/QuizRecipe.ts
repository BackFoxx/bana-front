import QuizOption from "@/entity/QuizOption";
import {Type} from "class-transformer";

export default class QuizRecipe {
    public temperature: string = '';
    @Type(() => QuizOption)
    public items: QuizOption[][] = [];
};