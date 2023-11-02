import { Prop, getModelForClass, Ref } from '@typegoose/typegoose';

import { ICloudinaryResponse, IPdfDoc } from '@types-local/';
import { UserModel } from './User.model';

class PdfDoc implements IPdfDoc{
    @Prop()
    fileName!: string;

    @Prop({ref: UserModel})
    owner!: Ref<typeof UserModel>;

    @Prop()
    storageData!: ICloudinaryResponse;
}

export const PdfDocModel = getModelForClass(PdfDoc, {schemaOptions: {collection: 'pdfDocs'}});