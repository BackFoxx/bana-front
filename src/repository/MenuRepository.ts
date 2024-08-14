import {singleton} from "tsyringe";
import AxiosClient from "@/repository/AxiosClient";
import Menu from "@/entity/Menu";
import AutoSearchResult from "@/entity/AutoSearchResult";
import MenuKeyword from "@/entity/MenuKeyword";

@singleton()
export default class MenuRepository {
    private readonly axiosClient: AxiosClient

    public constructor(axiosClient: AxiosClient) {
        this.axiosClient = axiosClient;
    }

    public getMenus(): Promise<Menu[]> {
        return this.axiosClient.get<Menu[]>(`/api/v1/menus`, null, Menu)
    }

    public autoSearch(keyword: string): Promise<AutoSearchResult[]> {
        return this.axiosClient.get(`/api/v1/menus/keywords/search`, {keyword: keyword}, AutoSearchResult);
    }

    public getKeywords(menuId: number): Promise<MenuKeyword[]> {
        return this.axiosClient.get(`/api/v1/menus/${menuId}/keywords`, null, MenuKeyword);
    }

    public deleteKeyword(keywordId: number) {
        return this.axiosClient.delete(`/api/v1/keywords/${keywordId}`, null);
    }

    public saveKeyword(menuId: number, keyword: string): Promise<MenuKeyword> {
        return this.axiosClient.post(`/api/v1/menus/${menuId}/keywords`, null, {keyword: keyword}, MenuKeyword);
    }

    public save(name: string) {
        return this.axiosClient.post(`/api/v1/menus`, null, {title: name}, Menu);
    }

    public delete(menuId: number) {
        return this.axiosClient.delete(`/api/v1/menus/${menuId}`, null);
    }

    public getMostSearchedMenus(): Promise<Menu[]> {
        return this.axiosClient.get<Menu[]>(`/api/v1/menus/search_count`, null, Menu)
    }
};