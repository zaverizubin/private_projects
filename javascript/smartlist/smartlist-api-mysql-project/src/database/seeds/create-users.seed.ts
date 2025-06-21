import { Seeder, Factory } from 'typeorm-seeding';
import { User } from '../../entities/user.entity';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(User)({password: 'Password@123'}).createMany(10);

    // await factory(User)({
    //   name: 'Amitav Roy',
    //   email: 'amitav.roy@focalworks.in',
    //   password: 'Password@123',
    // }).create();
  }
}
