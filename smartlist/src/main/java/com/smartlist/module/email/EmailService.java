package com.smartlist.module.email;

import com.smartlist.config.PropertiesConfig;
import com.smartlist.model.EmailLog;
import com.smartlist.module.report.dto.response.CandidateAssessmentReportRespDTO;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.File;
import java.util.*;

@Service
public class EmailService {

    //Autowired
    private final PropertiesConfig propertiesConfig;
    private final TemplateEngine templateEngine;
    private final EmailRepository emailRepository;

    //Global
    private final JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

    public  EmailService(final PropertiesConfig propertiesConfig, final TemplateEngine templateEngine,
                         final EmailRepository emailRepository){
        this.propertiesConfig = propertiesConfig;
        this.templateEngine = templateEngine;
        this.emailRepository = emailRepository;
    }

    private void sendEmail(final String[] toList, final String[] cclist, final String subject, final String content, final Map<String, File> inlineImagesMap)  {
        this.mailSender.setHost(this.propertiesConfig.getEmailHost());
        this.mailSender.setPort(Integer.parseInt(this.propertiesConfig.getEmailPort()));
        this.mailSender.setUsername(this.propertiesConfig.getEmailUsername());
        this.mailSender.setPassword(this.propertiesConfig.getEmailPassword());
        this.mailSender.setJavaMailProperties(getMailProperties());

        try{
            final MimeMessage mimeMessage = this.mailSender.createMimeMessage();
            final MimeMessageHelper msgHelper = new MimeMessageHelper(mimeMessage, true);

            msgHelper.setFrom(this.propertiesConfig.getEmailUsername());
            msgHelper.setTo(toList);
            if (cclist.length > 0) {
                msgHelper.setCc(cclist);
            }
            msgHelper.setSubject(subject);
            msgHelper.setText(content, true);
            msgHelper.addInline("header-logo", new ClassPathResource("images/smartlist.jpg"));
            for (Map.Entry<String, File> entry:inlineImagesMap.entrySet()) {
                msgHelper.addInline(entry.getKey(), entry.getValue());
            }


            this.mailSender.send(mimeMessage);
            logEmail(toList, content, null);

        }catch (MessagingException messagingException){
            logEmail(toList, content, messagingException.getMessage());
            throw new RuntimeException(messagingException);
        }
    }

    private void logEmail(final String[] toList, final String message, final String error){
        final List<EmailLog> emailLogs = new ArrayList<>();
        for(String to: toList){
            final EmailLog emailLog = new EmailLog();
            emailLog.setSender(this.propertiesConfig.getEmailUsername());
            emailLog.setReceiver(to);
            emailLog.setMessage(message);
            emailLog.setErrorLog(error);
            emailLogs.add(emailLog);
        }
        this.emailRepository.saveAll(emailLogs);
    }

    private Properties getMailProperties() {
        final Properties properties = new Properties();

        properties.setProperty("mail.transport.protocol", "smtp");
        properties.setProperty("mail.smtp.auth", "true");
        properties.setProperty("mail.smtp.starttls.enable", "true");
        properties.setProperty("mail.debug", "false");
        properties.setProperty("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

        return properties;
    }

    private String getClientDomain() {
        return this.propertiesConfig.getClientAppURL()
                + (this.propertiesConfig.getClientAppPort() != null ? ":" + this.propertiesConfig.getClientAppPort() + "/" : "/");
    }

    private Context getBaseContext(){
        final Context context = new Context();
        context.setVariable("appName", this.propertiesConfig.getServerAppName());
        context.setVariable("sender", this.propertiesConfig.getEmailUsername());
        context.setVariable("appURL", this.propertiesConfig.getServerAppURL());
        context.setVariable("supportEmail", this.propertiesConfig.getEmailSupport());
        context.setVariable("helpCenterURL", this.propertiesConfig.getServerHelpCenterURL());

        return context;
    }

    public void sendInviteToAppMail(final String to, final String from, final String token) {
        String url = this.getClientDomain() + this.propertiesConfig.getRouteInviteToApp() + "?email=" + to + "&token=" + token;
        String subject = "Invitation Mail";

        final Context context = getBaseContext();
        context.setVariable("invitee", from);
        context.setVariable("email", to);
        context.setVariable("url", url);

        String report = this.templateEngine.process("invite_to_app", context);

        sendEmail(new String[]{to}, new String[]{},  subject, report, new HashMap<>());
    }

    public void sendVerifyEmailMail(final String to, final String username, final String token) {
        String url = this.getClientDomain() + this.propertiesConfig.getRouteVerifyEmail() + "/" + token;
        String subject = "Verify Mail";

        final Context context = getBaseContext();
        context.setVariable("username", username);
        context.setVariable("email", to);
        context.setVariable("url", url);

        String report = this.templateEngine.process("verify_email", context);

        sendEmail(new String[]{to}, new String[]{}, subject, report, new HashMap<>());
    }

    public void sendForgotPasswordMail(final String to, final String token) {
        String url = this.getClientDomain() + this.propertiesConfig.getRouteForgotPassword() + "/" + token;
        String subject = "Forgot Password";

        final Context context = getBaseContext();
        context.setVariable("url", url);

        String report = this.templateEngine.process("forgot_password", context);

        sendEmail(new String[]{to}, new String[]{}, subject, report, new HashMap<>());
    }

    public void sendReportMail(final String to, final CandidateAssessmentReportRespDTO candidateReportRespDTO){
        String subject = "Candidate Assessment Report";

        final Context context = new Context();
        candidateReportRespDTO.populateIntoTemplateContext(context);

        String report = this.templateEngine.process("candidate_assessment_mail", context);

        final Map<String, File> inlineImagesMap = new HashMap<>();
        if(candidateReportRespDTO.getCandidatePhotoFile() != null){
            inlineImagesMap.put("candidate-photo", candidateReportRespDTO.getCandidatePhotoFile());
        }
        if(candidateReportRespDTO.getOrganizationLogoFile() != null){
            inlineImagesMap.put("organization-logo", candidateReportRespDTO.getOrganizationLogoFile());
        }
        sendEmail(new String[]{to}, new String[]{}, subject, report, inlineImagesMap);
    }
}
