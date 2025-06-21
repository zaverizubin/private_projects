import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { EmailLog } from 'src/entities/email-log.entity';
import { EmailLogDocument } from 'src/schemas/email-log.schema';
import DBConnectionService from './db.connection.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly dbConnectionService: DBConnectionService,
    @InjectConnection() private connection: Connection,
    @InjectModel(EmailLog.name)
    private emailLogModel: Model<EmailLogDocument>,
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
    const emailLogDocument: EmailLogDocument = new this.emailLogModel();
    emailLogDocument.status = true;
    emailLogDocument.sender = this.configService.get('EMAIL_SENDER');
    emailLogDocument.receiver = to;
    emailLogDocument.message = message;

    this.connection.collection('email-log').insertOne(emailLogDocument);
  }

  private async logError(to: string, message: string, errorLog: string) {
    const emailLogDocument: EmailLogDocument = new this.emailLogModel();
    emailLogDocument.status = false;
    emailLogDocument.sender = this.configService.get('EMAIL_SENDER');
    emailLogDocument.receiver = to;
    emailLogDocument.message = message;
    emailLogDocument.error_log = errorLog;

    this.connection.collection('email-log').insertOne(emailLogDocument);
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
