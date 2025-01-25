package nexusglobal.wordprocessor.enums;

public enum EmailTemplateType {

    WELCOME_EMAIL("Welcome Email"),
    NEW_ACCOUNT_CREATION("New Account Creation"),
    ACCOUNT_EXPIRY("Account Expiry"),
    PROVISIONING_ERROR("Provisioning Error"),
    HEADER("Header"),
    FOOTER("Footer");

    private final String subject;

    EmailTemplateType(String subject) {
        this.subject = subject;
    }

    public String getDefaultTemplate(){
        String value = "";
        switch (this){
            case ACCOUNT_EXPIRY :
                value = """
                    <p><span style='font-family:trebuchet ms,helvetica,sans-serif;font-size:14px'><em>Hey there!</em></span><br />
                    <span style='font-family:trebuchet ms,helvetica,sans-serif;font-size:14px'><em>I&rsquo;ve got an important message from APM suite.</em></span></p>
                    <p><span style='font-family:trebuchet ms,helvetica,sans-serif;font-size:14px'><em>Your user license(s) for 
                    ${ACCOUNT_COMPANY_NAME} will expire in 30 days!</em></span></p>
                    <p><strong><em>Expiry Date: ${EXPIRY_DATE} </em></strong></p>
                    <p><span style='font-family:trebuchet ms,helvetica,sans-serif;font-size:14px'><em>No worries, just login and renew your subscription(s) by clicking the <strong>Manage Licenses</strong> button within your Account Setup utility found under the Tools menu.&nbsp; It&rsquo;s super easy.&nbsp; </em></span></p>"
                    <p><span style='font-family:trebuchet ms,helvetica,sans-serif;font-size:14px'><em>If you have questions about your account or need additional help or information, please contact us at <a href='mailto:${SUPPORT_EMAIL_ADDRESS}'>support</a>.</em></span></p>"
                    <p><span style='font-family:trebuchet ms,helvetica,sans-serif;font-size:14px'><em>Cheers, </em><br /><em>The APM suite team</em></span></p>""";
                break;
            case WELCOME_EMAIL:
                value = """
                        <p style="margin:auto">
                            <img src="data:image/png;base64,
                             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" alt="APM Suite" />
                        </p>
                        <p>Hi ${ACCOUNT_FIRSTNAME} ${ACCOUNT_LASTNAME}</p>
                        <p>To get started with your free trial, click on the link below to set your password. For optimal viewing and ease of use, the software should be accessed through desktop or tablet devices. 
                        This &quot;Set your Password&quot; link will expire in 24hrs. If your link expires please follow your account URL below and click the &#39;forgot password&#39; link</p>
                        <a href="https://${ACCOUNT_SCHEMA}.${APMSUITE_BASE_URL}/${APMSUITE_RESETPASSWORD_URL}/${APMSUITE_RESETPASSWORD_UUID}" target="_blank">Set your Password</a>
                        <p>Once your password is set, you can easily access your APM suite account using the following information (bookmark your Account URL for easy access):</p>
                        <p><strong>Account URL:&nbsp;</strong>
                        <a href="https://${ACCOUNT_SCHEMA}.${APMSUITE_BASE_URL}" target="_blank">https://${ACCOUNT_SCHEMA}.${APMSUITE_BASE_URL}</a>
                        <br />
                        <strong>Username:&nbsp;</strong>${ACCOUNT_EMAIL}</p>
                        <p>&nbsp;</p>
                        <p>To help you get started using APM suite, click on the question mark in the top-right corner of the software to access the user guide and help video tutorials.</p>
                        <p>During your 30 day free trial, you will have full&nbsp;functionality and access to all of the Business Plan features. If you are subscribed to the Lite Plan and would like to continue using all of the Business Plan features, you will be given the option to upgrade at the end of your trial period.</p>
                        <p>I will be checking in over the next couple weeks with tips and best practices to help you get up and running. 
                        If you have any questions please feel free to reach out to me or you can contact our support team&nbsp;<a href="mailto:${SUPPORT_EMAIL}" rel=" noopener" target="_blank">here.</a></p>
                        <p>Your Client Success Manager,</p>
                        <p>Shannon Warlop<br />
                        <a href="mailto:s.warlop@nexusglobal.com" rel=" noopener" target="_blank">s.warlop@nexusglobal.com</a></p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p style="text-align:center"><span style="font-size:10px">Nexus Global Business Solutions, Inc.<br />
                        4909 Unicon Dr,&nbsp;Suite 119&nbsp;&bull; Wake Forest,&nbsp;NC&nbsp;27587</span></p>
                        <p style="text-align:center"><br />
                        <span style="font-size:10px">You received this email because you are subscribed to Software Subscriber from Nexus Global Business Solutions, Inc..<br />
                        Update your&nbsp;<a href="https://email.nexusglobal.com/hs/manage-preferences/unsubscribe-test?d=VmYj8y87cQqPVKgD3Q3_YlyBW2m3bL73_YlyBN1JxwY5GKd_PM20N4JvcMJJVl6t-B68HmGJF8V5kJ65br01&amp;v=3" target="_blank">email preferences</a>&nbsp;to choose the types of emails you receive. &nbsp;<a href="https://email.nexusglobal.com/hs/manage-preferences/unsubscribe-all-test?d=VmYj8y87cQqPVKgD3Q3_YlyBW2m3bL73_YlyBN1JxwY5GKd_PM20N4JvcMJJVl6t-B68HmGJF8V5kJ65br01&amp;v=3" target="_blank">Unsubscribe from all future emails</a>&nbsp;</span></p>
                        """;
                break;

            case NEW_ACCOUNT_CREATION:
                value = """
                    There was an account created for: ${ACCOUNT_FIRSTNAME} ${ACCOUNT_LASTNAME}  Email: ${ACCOUNT_EMAIL}  Plan Name: ${ACCOUNT_PLANS}
                    """;
                break;
            case PROVISIONING_ERROR:
                value = """
                    There was an error provisioning for account: ${ACCOUNT_FIRSTNAME} ${ACCOUNT_LASTNAME}  Email: ${ACCOUNT_EMAIL} <br/><br/>
                    ${STACK_TRACE}
                    """;
                break;
            default:
                break;
        }
        return value;
    }

    @Override
    public String toString() {
        return this.subject;
    }
}
