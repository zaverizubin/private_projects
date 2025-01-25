package com.smartlist.module.sms;

import com.twilio.Twilio;
import com.twilio.exception.ApiException;
import com.twilio.rest.api.v2010.account.Message;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
@Slf4j
public class SMSService {

    private static final String ACCOUNT_SID = "AC5d9d6d27042b55773e5ded419eb1efa7";
    private static final String AUTH_TOKEN = "fef6695f579d73276278c20207cc453c";


    public String sendOTP(final String contactNumber, final Integer verificationCode) {
        return sendViaTwilio(contactNumber, verificationCode);
    }

    private String sendViaTwilio(final String contactNumber, final Integer verificationCode){
        try{
            //This SMS sample uses Twilio ("https://console.twilio.com/" Use google sign-in zaverizubin@gmail.com)
            Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
            Message message = Message.creator(
                            new com.twilio.type.PhoneNumber("+91" + contactNumber),
                            new com.twilio.type.PhoneNumber("+12059276111"),
                            "Please use this verification code to register with smartlist: " + verificationCode)
                    .create();
            return message.getSid();
        } catch (final ApiException e) {
            log.error(e.getMessage());
            return "Error: " + e;
        }

    }

    private String sendViaTextLocal(final String contactNumber, final Integer verificationCode){
        try {
            //This SMS example uses TextLocal(https://www.textlocal.in/)
            String apiKey = "apikey=" + "NTk0ODU5NmY0Nzc4NGE1NTZmMzk0NzY4NTc2MzRhNGM=";
            String message = "&message=" + verificationCode;
            String sender = "&sender=" + "TXTLCL";
            String numbers = "&numbers=" + "91" + contactNumber;

            // Send data
            HttpURLConnection conn = (HttpURLConnection) new URL("https://api.textlocal.in/send/?").openConnection();
            String data = apiKey + numbers + message + sender;
            conn.setDoOutput(true);
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Length", Integer.toString(data.length()));
            conn.getOutputStream().write(data.getBytes("UTF-8"));
            final BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            final StringBuilder stringBuffer = new StringBuilder();
            String line;
            while ((line = rd.readLine()) != null) {
                stringBuffer.append(line);
            }
            rd.close();

            return stringBuffer.toString();
        } catch (Exception e) {
            System.out.println("Error SMS "+e);
            return "Error "+e;
        }

    }
}
