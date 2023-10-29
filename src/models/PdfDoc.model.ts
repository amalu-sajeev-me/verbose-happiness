import { Prop, getModelForClass } from '@typegoose/typegoose';

import { ICloudinaryResponse, IPdfDoc } from '@types-local/';
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