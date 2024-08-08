import {singleton} from "tsyringe";
import AxiosClient from "@/repository/AxiosClient";
import MenuRecipe from "@/entity/MenuRecipe";
import Null from "@/entity/Null";

@singleton()
export default class MenuRecipeItemRepository {
    private readonly axiosClient: AxiosClient

    public constructor(axiosClient: AxiosClient) {
        this.axiosClient = axiosClient;
    }

    public getItems(menuId: number, temperature: string): Promise<MenuRecipe[]> {
        return this.axiosClient.get(`/api/v1/menus/${menuId}/recipes`, {temperature: temperature}, MenuRecipe);
    }

    public update(menuId: number, items: MenuRecipe[]) {
        return this.axiosClient.patch(`/api/v1/menus/:menuId/recipes`, null, {items: items}, Null);
    }
};