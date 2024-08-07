import {DateTimeFormatter, LocalDateTime} from "@js-joda/core";

export default class TimeFormatter {
    private static readonly DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss"

    public static parseDateTime(s: string, format = TimeFormatter.DATETIME_FORMAT): LocalDateTime {
        return LocalDateTime.parse(s, DateTimeFormatter.ofPattern(format));
    }
};