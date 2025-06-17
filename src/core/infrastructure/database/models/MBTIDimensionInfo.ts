import mongoose, { Schema, Document } from 'mongoose';
import { MBTIDimensionInfo as MBTIDimensionInfoEntity } from '@/core/domain/entities/MBTIDimensionInfo';

export interface MBTIDimensionInfoDocument extends Omit<MBTIDimensionInfoEntity, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const MBTIDimensionInfoSchema = new Schema<MBTIDimensionInfoDocument>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name_en: {
    type: String,
    required: true,
  },
  name_vi: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  keywords: [{
    type: String,
    required: true,
  }],
  examples: [{
    type: String,
  }],
  dimension_type: {
    type: String,
    required: true,
    enum: ['EI', 'SN', 'TF', 'JP'],
  },
}, {
  timestamps: true,
});

const MBTIDimensionInfo = mongoose.models.MBTIDimensionInfo || mongoose.model<MBTIDimensionInfoDocument>('MBTIDimensionInfo', MBTIDimensionInfoSchema);

export default MBTIDimensionInfo; 