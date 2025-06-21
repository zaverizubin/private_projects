import { AppResponseCodes } from 'src/app.response.codes';
import * as mongoose from 'mongoose';

const PASSWORD = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
const QUESTION = /(<([^>]+)>)/gi;

export const REGEX = {
  PASSWORD,
  QUESTION,
};

export function arrayHasDuplicates(arr: any[]): boolean {
  let hasDuplicates = false;
  arr.forEach((c, index) => {
    if (index != arr.indexOf(c)) {
      hasDuplicates = true;
    }
  });
  return hasDuplicates;
}

export function generateOTP(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

export function convertToUpperCamelCase(value: string) {
  if (value) {
    value = value.charAt(0).toUpperCase() + value.slice(1);
  }
  return value;
}

export function verifyMongoDBIdOrThrow(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw AppResponseCodes.INVALID_ID;
  }
}
