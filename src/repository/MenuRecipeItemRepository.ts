import {singleton} from "tsyringe";
import AxiosClient from "@/repository/AxiosClient";
import MenuRecipe from "@/entity/MenuRecipe";

@singleton()
export default class MenuRecipeItemRepository {
    private readonly axiosClient: AxiosClient

    public constructor(axiosClient: AxiosClient) {
        this.axiosClient = axiosClient;
    }

    public getItems(menuId: number, temperature: string): Promise<MenuRecipe[]> {
        return this.axiosClient.get(`/api/v1/menus/${menuId}/recipes`, {temperature: temperature}, MenuRecipe);
    }
};