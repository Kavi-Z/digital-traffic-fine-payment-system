package traffic.example.traffic_fines_api.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class SmsService {

    @Value("${twilio.account-sid:}")
    private String accountSid;

    @Value("${twilio.auth-token:}")
    private String authToken;

    @Value("${twilio.phone-number:}")
    private String fromPhone;

    @Value("${twilio.enabled:false}")
    private boolean enabled;

    /**
     * Sends an SMS to the officer when a fine is paid.
     * Uses Twilio if configured; otherwise logs the message.
     */
    public boolean sendPaymentNotification(String toPhone, String officerName,
                                           String referenceNumber, String driverName,
                                           double amount) {
        String message = String.format(
                "Sri Lanka Police - Fine Payment Confirmed\n" +
                        "Officer: %s\n" +
                        "Reference: %s\n" +
                        "Driver: %s\n" +
                        "Amount: LKR %.2f\n" +
                        "Status: PAID\n" +
                        "Driver may retrieve their license.",
                officerName, referenceNumber, driverName, amount
        );

        if (!enabled) {
            log.info("SMS DISABLED - Would send to {}: {}", toPhone, message);
            return true; // Simulate success
        }

        try {
            // Twilio REST API call via simple HTTP (no SDK needed)
            String url = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json";
            String body = "To=" + toPhone + "&From=" + fromPhone + "&Body=" + java.net.URLEncoder.encode(message, "UTF-8");

            java.net.HttpURLConnection conn = (java.net.HttpURLConnection)
                    new java.net.URL(url).openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

            String credentials = accountSid + ":" + authToken;
            String encoded = java.util.Base64.getEncoder().encodeToString(credentials.getBytes());
            conn.setRequestProperty("Authorization", "Basic " + encoded);

            conn.getOutputStream().write(body.getBytes());

            int responseCode = conn.getResponseCode();
            if (responseCode == 201) {
                log.info("SMS sent successfully to officer at {}", toPhone);
                return true;
            } else {
                log.error("SMS failed with HTTP {}", responseCode);
                return false;
            }
        } catch (Exception e) {
            log.error("Failed to send SMS to {}: {}", toPhone, e.getMessage());
            return false;
        }
    }
}