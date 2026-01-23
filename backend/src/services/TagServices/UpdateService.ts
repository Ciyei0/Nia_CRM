import * as Yup from "yup";

import AppError from "../../errors/AppError";
import Tag from "../../models/Tag";
import ShowService from "./ShowService";

interface TagData {
  id?: number;
  name?: string;
  color?: string;
  kanban?: number;
  isDefault?: boolean;
}

interface Request {
  tagData: TagData;
  id: string | number;
}

const UpdateUserService = async ({
  tagData,
  id
}: Request): Promise<Tag | undefined> => {
  const tag = await ShowService(id);

  const schema = Yup.object().shape({
    name: Yup.string().min(3)
  });

  const { name, color, kanban, isDefault } = tagData;

  try {
    await schema.validate({ name });
  } catch (err: any) {
    throw new AppError(err.message);
  }

  // Si se marca como predeterminada, desmarcar cualquier otra de la misma empresa
  if (isDefault) {
    await Tag.update(
      { isDefault: false },
      { where: { companyId: tag.companyId, isDefault: true } }
    );
  }

  await tag.update({
    name,
    color,
    kanban,
    isDefault
  });

  await tag.reload();
  return tag;
};

export default UpdateUserService;
