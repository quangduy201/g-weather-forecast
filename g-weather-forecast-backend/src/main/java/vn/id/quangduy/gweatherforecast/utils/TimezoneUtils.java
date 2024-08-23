package vn.id.quangduy.gweatherforecast.utils;

import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

public class TimezoneUtils {

    public static void main(String[] args) {
        double clientOffset = getClientTimezoneOffsetAt(7);
        System.out.println("Timezone offset where it is 7 AM: " + clientOffset + " hours");
    }

    public static double convertTimezoneToDouble(String timezoneOffset) {
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of(timezoneOffset));
        return now.getOffset().getTotalSeconds() / 3600.0;
    }

    public static double getClientTimezoneOffsetAt(int targetHour) {
        // Vietnam
//        ZonedDateTime serverTime = ZonedDateTime.of(
//                LocalDateTime.of(2024, 8, 23, 0, 0),
//                ZoneId.of("+07:00"));
        ZonedDateTime serverTime = ZonedDateTime.now(); // Server's current time
        ZonedDateTime utcTime = serverTime.withZoneSameInstant(ZoneOffset.UTC); // Convert to UTC
        ZonedDateTime clientTime = utcTime.truncatedTo(ChronoUnit.DAYS).plusHours(targetHour); // Get the client's daily hour
        if (utcTime.getDayOfMonth() < serverTime.getDayOfMonth()) {
//            System.out.println("Before");
            clientTime = clientTime.plusDays(1);
        }

//        System.out.println("Server time: " + serverTime);
//        System.out.println("UTC time: " + utcTime);
//        System.out.println("Client time: " + clientTime);

        long minutesDifference = ChronoUnit.MINUTES.between(clientTime, utcTime); // Offset minute between client and UTC
        double hoursDifference = minutesDifference / 60.0;

        return -hoursDifference;
    }
}
