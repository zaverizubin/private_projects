import { Injectable } from '@nestjs/common';
import axios from 'axios';
import DBConnectionService from './db.connection.service';
import { CandidateSmsLog } from 'src/entities/sms-log.entity';
import { Connection } from 'typeorm';

@Injectable()
export class SmsService {
  url = `${process.env.SMS_PROVIDER_URL}`;
  authorization = `${process.env.SMS_AUTHORIZATION_KEY}`;
  route = `${process.env.SMS_ROUTE}`;
  senderId = `${process.env.SMS_SENDER_ID}`;
  language = `${process.env.SMS_LANGUAGE}`;
  flash = `${process.env.SMS_FLASH}`;

  getUrl(message: string, contactNumber: string) {
    const enCodedMessage = encodeURI(message);
    const dataUrl =
      this.url +
      `?authorization=${this.authorization}&route=${this.route}&sender_id=${this.senderId}&language=${this.language}&flash=${this.flash}&message=${enCodedMessage}&numbers=${contactNumber}`;
    return dataUrl;
  }

  constructor(private readonly dbConnectionService: DBConnectionService) {}

  async sendOtp(contactNumber: string, otp: number): Promise<boolean> {
    const messageContent = `Your smartlist OTP is ${otp}`;
    const urlData = this.getUrl(messageContent, contactNumber);
    const response = await this.sendSms(urlData);
    await this.logResponse(contactNumber, response);
    return true;
  }

  private async sendSms(urlData: string): Promise<any> {
    try {
      const response = await axios({
        method: 'get',
        url: urlData,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  private getHeader() {
    const base64encodedData: string = Buffer.from(
      `${process.env.SMS_UID}:${process.env.SMS_TOKEN}`,
    ).toString('base64');
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${base64encodedData}`,
    };
  }

  private async logResponse(to: string, responseData: any) {
    const candidateSmsLog: Partial<CandidateSmsLog> = {
      status: responseData.return == true ? 'success' : 'failed',
      sender: responseData.request_id,
      receiver: to,
      response: JSON.stringify(responseData),
      uid: responseData.request_id,
    };
    const connection: Connection =
      await this.dbConnectionService.getConnection();
    connection
      .getRepository(CandidateSmsLog)
      .save(candidateSmsLog as CandidateSmsLog);
  }
}
