import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailLog } from 'src/entities/email-log.entity';
import DBConnectionService from './db.connection.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly dbConnectionService: DBConnectionService,
  ) {}

  private async sendMail(
    to: string,
    subject: string,
    template: string,
    context: Record<string, unknown>,
  ) {
    return this.mailerService
      .sendMail({
        to: to,
        subject: subject,
        template: './' + template,
        context: context,
      })
      .then(() => {
        console.log('success');
        this.logSuccess(to, template);
        return true;
      })
      .catch((err) => {
        console.log('failed' + err);
        this.logError(to, template, err.message);
        return false;
      });
  }

  private getClientDomain(): string {
    let client_domain: string =
      this.configService.get<string>('CLIENT_APP_DOMAIN');
    if (this.configService.get<string>('CLIENT_APP_PORT') != '') {
      client_domain =
        client_domain +
        ':' +
        this.configService.get<string>('CLIENT_APP_PORT') +
        '/';
    } else {
      client_domain = client_domain + '/';
    }
    return client_domain;
  }

  private async logSuccess(to: string, message: string) {
    const emailLog: Partial<EmailLog> = {
      status: true,
      sender: this.configService.get('EMAIL_SENDER'),
      receiver: to,
      message: message,
    };
    const connection = await this.dbConnectionService.getConnection();
    connection.getRepository(EmailLog).save(emailLog as EmailLog);
  }

  private async logError(to: string, message: string, errorLog: string) {
    const emailLog: Partial<EmailLog> = {
      status: false,
      sender: this.configService.get('EMAIL_SENDER'),
      receiver: to,
      message: message,
      error_log: errorLog,
    };
    const connection = await this.dbConnectionService.getConnection();
    connection.getRepository(EmailLog).save(emailLog as EmailLog);
  }

  public getBaseContext(): Record<string, string> {
    return {
      appName: this.configService.get<string>('APP_NAME'),
      sender: this.configService.get<string>('EMAIL_SENDER'),
      appURL: this.configService.get<string>('APP_URL'),
      supportEmail: this.configService.get<string>('EMAIL_SUPPORT'),
      helpCenterURL: this.configService.get<string>('HELP_CENTER_URL'),
    };
  }

  async sendInviteToAppMail(
    to: string,
    from: string,
    token: string,
  ): Promise<boolean> {
    const context: Record<string, unknown> = this.getBaseContext();
    (context.invitee = from),
      (context.email = to),
      (context.url =
        this.getClientDomain() +
        this.configService.get<string>('ROUTE_INVITE_TO_APP') +
        '?email=' +
        to +
        '&token=' +
        token);
    return this.sendMail(to, 'Invitation Mail', 'invite_to_app', context);
  }

  async sendVerifyEmailMail(
    to: string,
    username: string,
    token: string,
  ): Promise<boolean> {
    const context: Record<string, unknown> = this.getBaseContext();
    (context.username = username),
      (context.email = to),
      (context.url =
        this.getClientDomain() +
        this.configService.get<string>('ROUTE_VERIFY_EMAIL') +
        '/' +
        token);
    return this.sendMail(to, 'Verify Email', 'verify_email', context);
  }

  async sendReportMail(
    to: string,
    data: Record<string, unknown>,
  ): Promise<boolean> {
    return this.sendMail(
      to,
      'Candidate Assessment Report',
      'candidate_assessment',
      data,
    );
  }

  async sendForgotPasswordMail(to: string, token: string): Promise<boolean> {
    const context: Record<string, unknown> = this.getBaseContext();
    context.url =
      this.getClientDomain() +
      this.configService.get<string>('ROUTE_FORGOT_PASSWORD') +
      '/' +
      token;

    return this.sendMail(to, 'Forgot Password', 'forgot_password', context);
  }
}
