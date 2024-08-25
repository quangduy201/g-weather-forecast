package vn.id.quangduy.gweatherforecast.utils;

import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

public class TimezoneUtils {

    public static double convertTimezoneToDouble(String timezoneOffset) {
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of(timezoneOffset));
        return now.getOffset().getTotalSeconds() / 3600.0;
    }

    public static double getClientTimezoneOffsetAt(int targetHour) {
        ZonedDateTime serverTime = ZonedDateTime.now(); // Server's current time
        ZonedDateTime utcTime = serverTime.withZoneSameInstant(ZoneOffset.UTC); // Convert to UTC
        ZonedDateTime clientTime = utcTime.truncatedTo(ChronoUnit.DAYS).plusHours(targetHour); // Get the client's daily hour
        if (utcTime.getDayOfMonth() < serverTime.getDayOfMonth()) {
            clientTime = clientTime.plusDays(1);
        }

        long minutesDifference = ChronoUnit.MINUTES.between(clientTime, utcTime); // Offset minute between client and UTC
        double hoursDifference = minutesDifference / 60.0;
        double roundedValue = Math.round(hoursDifference * 4) / 4.0; // Round to the nearest quarter

        return -roundedValue;
    }
}
