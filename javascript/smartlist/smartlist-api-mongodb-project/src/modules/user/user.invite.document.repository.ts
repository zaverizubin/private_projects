import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { OrganizationDocument } from 'src/schemas/organization.schema';
import { UserInvite, UserInviteDocument } from 'src/schemas/user-invite.schema';

@Injectable()
export class UserInviteDocumentRepository {
  constructor(
    @InjectModel(UserInvite.name)
    private userInviteModel: Model<UserInviteDocument>,
  ) { }

  getModelInstance(): UserInviteDocument {
    return new this.userInviteModel();
  }

  async save(
    userInviteDocument: UserInviteDocument,
  ): Promise<UserInviteDocument> {
    return userInviteDocument.save();
  }

  async delete(
    userInviteDocument: UserInviteDocument,
  ): Promise<UserInviteDocument> {
    return userInviteDocument.remove();
  }

  async findByEmail(email: string): Promise<UserInviteDocument> {
    return this.userInviteModel.findOne({ email: email }).exec();
  }

  async findByToken(token: string): Promise<UserInviteDocument> {
    return this.userInviteModel.findOne({ token: token }).exec();
  }

  async findByEmailAndOrganization(
    email: string,
    organization: OrganizationDocument,
  ): Promise<UserInviteDocument> {
    return this.userInviteModel
      .findOne({ email: email, organizationDocument: organization })
      .exec();
  }

  async findAllByOrganization(
    organization: OrganizationDocument,
  ): Promise<UserInviteDocument[]> {
    return this.userInviteModel.find({ organizationDocument: organization }).exec();
  }
}
