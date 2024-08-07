import {LocalDateTime} from "@js-joda/core";
import {Exclude, Transform} from "class-transformer";
import TimeFormatter from "@/util/TimeFormatter";

export default class Menu {
    public id = 0
    public title = ''
    public searchCount = 0
    public image = ''

    @Exclude({ toPlainOnly: true })
    @Transform(({ value }) => TimeFormatter.parseDateTime(value), { toClassOnly: true })
    public createdAt = LocalDateTime.now();
};