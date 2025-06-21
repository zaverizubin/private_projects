import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { verifyMongoDBIdOrThrow } from 'src/utils/app.utils';
import { User, UserDocument } from 'src/schemas/user.schema';
import { OrganizationDocument } from 'src/schemas/organization.schema';

@Injectable()
export class UserDocumentRepository {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) { }

  getModelInstance(): UserDocument {
    return new this.userModel();
  }

  async save(userDocument: UserDocument): Promise<UserDocument> {
    return userDocument.save();
  }

  async findByName(name: string): Promise<UserDocument> {
    return this.userModel.findOne({ name: name }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email: email }).exec();
  }


  async findAllByOrganization(
    organization: OrganizationDocument,
  ): Promise<UserDocument[]> {
    return this.userModel.find({ organizationDocument: organization }).exec();
  }

  async findByEmailVerificationToken(token: string): Promise<UserDocument> {
    return this.userModel.findOne({ 'email_verification.token': token }).exec();
  }

  async findByForgotPasswordToken(token: string): Promise<UserDocument> {
    return this.userModel.findOne({ 'forgot_password.token': token }).exec();
  }

  async findById(id: string): Promise<UserDocument> {
    verifyMongoDBIdOrThrow(id);
    return this.userModel.findById(id).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }
}
