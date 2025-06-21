import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from '../../entities/user.entity';

define(User, (faker: typeof Faker, context?: User) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);
  const email = faker.internet.email(firstName, lastName);

  const user = new User();
  user.name = context?.name || `${firstName} ${lastName}`;
  user.email = context?.email || email;
  user.password = context?.password || faker.random.word();
  user.active = context?.active || faker.random.boolean();
  return user;
});
