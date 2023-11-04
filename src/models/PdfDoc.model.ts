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

    @Prop()
    pageCount?: number;

    @Prop()
    bytes!: number;
}

export const PdfDocModel = getModelForClass(PdfDoc, {schemaOptions: {collection: 'pdfDocs'}});