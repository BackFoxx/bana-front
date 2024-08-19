import QuizMenu from "@/entity/QuizMenu";
import {Type} from "class-transformer";
import QuizRecipe from "@/entity/QuizRecipe";

export default class Quiz {
    @Type(() => QuizMenu)
    public menu = new QuizMenu();

    @Type(() => QuizRecipe)
    public recipes = new QuizRecipe();

    public getTemperature() {
        return this.recipes.temperature;
    }

    public isIce() {
        return this.getTemperature() === 'ICE';
    }

    getRecipeSize() {
        return this.recipes.items.length;
    }
};

