import { type Types, Schema, model } from 'mongoose';

import { simpleIdDBSchema, dateDBSchema } from './_schemaPartials';
import type { Edited } from './_modelTypePartials';

export interface DBPrivilege {
  id?: string;
  simpleId: string;
  priCategoryId: string;
  priOwnerId: string;
  priAccessId: string;
  name: string;
  description: string;
  created: Date;
  edited: Edited;
  systemDocument?: boolean;
  privilegeViewAccess: {
    users: Types.ObjectId[];
    groups: Types.ObjectId[];
    excludeUsers: Types.ObjectId[];
    excludeGroups: Types.ObjectId[];
  };
  privilegeEditAccess: {
    users: Types.ObjectId[];
    groups: Types.ObjectId[];
    excludeUsers: Types.ObjectId[];
    excludeGroups: Types.ObjectId[];
  };
  privilegeAccess: {
    public: boolean;
    users: Types.ObjectId[];
    groups: Types.ObjectId[];
    excludeUsers: Types.ObjectId[];
    excludeGroups: Types.ObjectId[];
  };
}

const privilegeSchema = new Schema<DBPrivilege>({
  simpleId: simpleIdDBSchema,
  priCategoryId: { type: String, required: true },
  priOwnerId: { type: String, required: true },
  priAccessId: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  created: dateDBSchema,
  edited: [
    {
      _id: false,
      user: {
        type: Schema.Types.ObjectId,
      },
      date: dateDBSchema,
    },
  ],
  systemDocument: { type: Boolean, default: false },
  privilegeViewAccess: {
    users: {
      _id: false,
      type: Schema.Types.ObjectId,
    },
    groups: {
      _id: false,
      type: Schema.Types.ObjectId,
    },
    excludeUsers: {
      _id: false,
      type: Schema.Types.ObjectId,
    },
    excludeGroups: {
      _id: false,
      type: Schema.Types.ObjectId,
    },
  },
  privilegeEditAccess: {
    users: {
      _id: false,
      type: Schema.Types.ObjectId,
    },
    groups: {
      _id: false,
      type: Schema.Types.ObjectId,
    },
    excludeUsers: {
      _id: false,
      type: Schema.Types.ObjectId,
    },
    excludeGroups: {
      _id: false,
      type: Schema.Types.ObjectId,
    },
  },
  privilegeAccess: {
    public: { type: Boolean, required: true, default: false },
    users: {
      _id: false,
      type: Schema.Types.ObjectId,
    },
    groups: {
      _id: false,
      type: Schema.Types.ObjectId,
    },
    excludeUsers: {
      _id: false,
      type: Schema.Types.ObjectId,
    },
    excludeGroups: {
      _id: false,
      type: Schema.Types.ObjectId,
    },
  },
});

privilegeSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = String(returnedObject._id);
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const DBPrivilegeModel = model<DBPrivilege>('Privilege', privilegeSchema, 'privileges');

export default DBPrivilegeModel;