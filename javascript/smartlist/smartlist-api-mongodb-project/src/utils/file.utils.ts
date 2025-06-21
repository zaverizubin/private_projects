import { Readable } from 'stream';
import { Response } from 'express';
import * as fs from 'fs';
const puppeteer = require('puppeteer');
const hbs = require('hbs');

const ALLOWED_IMAGE_FILE_EXTENSIONS = /\/(jpg|jpeg|png|gif)$/;
const ALLOWED_VIDEO_FILE_EXTENSIONS =
  /\/(flv|mp4|m3u8|mov|avi|wmv|3gp|mkv|webm)$/;

const ALLOWED_VIDEO_FILE_EXTENSIONS_ALL = /video/;
const ALLOWED_FILE_EXTENSIONS =
  /\/(pdf|msword|txt|vnd.openxmlformats-officedocument.wordprocessingml.document|plain|vnd.ms-powerpoint|vnd.openxmlformats-officedocument.presentationml.pr|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet)$/;

export const REGEX = {
  ALLOWED_IMAGE_FILE_EXTENSIONS,
  ALLOWED_VIDEO_FILE_EXTENSIONS: ALLOWED_VIDEO_FILE_EXTENSIONS_ALL,
  ALLOWED_FILE_EXTENSIONS,
};

async function compile(data: any, filePath: string): Promise<string> {
  try {
    const htmlData = await fs.readFileSync(filePath, 'utf-8');
    return await hbs.compile(htmlData)(data);
  } catch (error) {
    throw error;
  }
}

export async function generatePdf(
  reportData: any,
  templateFilePath: string,
): Promise<Buffer> {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const content = await compile(reportData, templateFilePath);
    await page.setContent(content);
    const byteArray = await page.pdf({
      format: 'A4',
      landscape: false,
      printBackground: true,
    });

    const buffer: Buffer = Buffer.from(byteArray, 'binary');
    await browser.close();
    return buffer;
  } catch (err) {
    throw err;
  }
}

export function setDataAndHeaderInRes(
  res: Response,
  buffer: Buffer,
  fileName: string,
): Response {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  stream.pipe(res);
  setHeader(res, fileName);
  return res;
}

export function setHeader(res: Response, fileName: string) {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=' + fileName + '.pdf',
  );
}
