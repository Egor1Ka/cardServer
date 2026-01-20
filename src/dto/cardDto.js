import mongoose from "mongoose";

const toObjectId = (value) => {
  if (!value) return undefined;
  if (!mongoose.isValidObjectId(value)) return undefined;
  return new mongoose.Types.ObjectId(value);
};

const toObjectIdArray = (value) => {
  if (!Array.isArray(value)) return undefined;
  const ids = value
    .map((item) => toObjectId(item))
    .filter((item) => item);
  return ids.length ? ids : undefined;
};

export default {
  toDTO: (doc) => {
    if (!doc) return null;
    const data = doc.toObject ? doc.toObject() : doc;
    return {
      id: data._id?.toString(),
      front: data.front,
      back: data.back,
      tags: data.tags,
      notes: data.notes,
      source: data.source,
      statusList: data.statusList,
      containers: data.containers?.map((container) =>
        container?._id ? container._id.toString() : container
      ),
      userId: data.userId?._id ? data.userId._id.toString() : data.userId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
  toEntity: (dto) => ({
    _id: dto?.id ? toObjectId(dto.id) : undefined,
    front: dto?.front,
    back: dto?.back,
    tags: dto?.tags,
    notes: dto?.notes,
    source: dto?.source,
    statusList: dto?.statusList || ["draft"],
    containers: toObjectIdArray(dto?.containers),
    userId: dto?.userId ? toObjectId(dto.userId) : undefined,
    createdAt: dto?.createdAt,
    updatedAt: dto?.updatedAt,
  }),
};
