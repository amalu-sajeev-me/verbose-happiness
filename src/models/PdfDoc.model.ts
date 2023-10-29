import { Prop, getModelForClass } from '@typegoose/typegoose';
import { ICloudinaryResponse } from '../types/ICloudinaryResponse.type';
import { IPdfDoc } from '../types/IPdfDoc.type';
// import { IUserEntity } from 'src/types/IUserEntity.type';
// import { UserModel } from './User.model';

class PdfDoc implements IPdfDoc{
    @Prop()
    fileName!: string;

    // @Prop({ref: UserModel})
    // owner!: Ref<typeof UserModel>;

    @Prop()
    storageData!: ICloudinaryResponse;
}

export const PdfDocModel = getModelForClass(PdfDoc, {schemaOptions: {collection: 'pdfDocs'}});