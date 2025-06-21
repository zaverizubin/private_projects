const PASSWORD = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export const REGEX = {
  PASSWORD,
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

export function convertFirstLetterCapital(value: string) {
  if (value) {
    value = value.charAt(0).toUpperCase() + value.slice(1);
  }
  return value;
}
