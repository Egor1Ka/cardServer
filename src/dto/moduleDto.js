import mongoose from "mongoose";

const toObjectId = (value) => {
  if (!value) return undefined;
  if (!mongoose.isValidObjectId(value)) return undefined;
  return new mongoose.Types.ObjectId(value);
};

const toObjectIdArray = (value) => {
  if (!Array.isArray(value)) return undefined;
  const ids = value.map((item) => toObjectId(item)).filter((item) => item);
  return ids.length ? ids : undefined;
};

export default {
  toDTO: (doc) => {
    if (!doc) return null;
    const data = doc.toObject ? doc.toObject() : doc;

    return {
      id: data._id?.toString(),
      name: data.name,
      description: data.description,
      cards: data.cards?.map((card) =>
        card?._id ? card._id.toString() : card,
      ),
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
  toEntity: (dto) => ({
    _id: dto?.id ? toObjectId(dto.id) : undefined,
    name: dto?.name,
    description: dto?.description,
    cards: toObjectIdArray(dto?.cards),
    createdBy: toObjectId(dto?.createdBy?.id ?? dto?.createdBy),
    createdAt: dto?.createdAt,
    updatedAt: dto?.updatedAt,
  }),
};
