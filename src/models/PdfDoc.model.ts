import { Prop, getModelForClass } from '@typegoose/typegoose';

import { ICloudinaryResponse, IPdfDoc } from '@types-local/';
import { UserModel } from './User.model';

class PdfDoc implements Partial<IPdfDoc>{
    @Prop()
    fileName!: string;

    @Prop({ref: UserModel})
    owner!: string;

    @Prop()
    storageData!: ICloudinaryResponse;

    @Prop()
    pageCount?: number;

    @Prop()
    bytes!: number;
}

export const PdfDocModel = getModelForClass(PdfDoc, {schemaOptions: {collection: 'pdfDocs'}});