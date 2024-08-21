import AxiosClient from "@/repository/AxiosClient";
import {singleton} from "tsyringe";
import Group from "@/entity/Group";
import Menu from "@/entity/Menu";
import Null from "@/entity/Null";

@singleton()
export default class GroupRepository {
    private readonly axiosClient: AxiosClient

    public constructor(axiosClient: AxiosClient) {
        this.axiosClient = axiosClient;
    }

    public getGroups(): Promise<Group[]> {
        return this.axiosClient.get('/api/v1/groups', null, Group);
    }

    public save(body: {
        name: string,
        image: string
    }): Promise<Group> {
        return this.axiosClient.post('/api/v1/groups', null, body, Group);
    }

    public getMenusByGroupId(groupId: number): Promise<Menu[]> {
        return this.axiosClient.get(`/api/v1/groups/${groupId}/menus`, null, Menu);
    }

    public alignMenuToGroup(menuId: number, groupId: number) {
        return this.axiosClient.post(`/api/v1/groups/${groupId}/menus`, null, {menuId: menuId}, Null);
    }
};