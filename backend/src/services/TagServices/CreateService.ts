import * as Yup from "yup";

import AppError from "../../errors/AppError";
import Tag from "../../models/Tag";

interface Request {
  name: string;
  color: string;
  kanban: number;
  companyId: number;
  isDefault?: boolean;
}

const CreateService = async ({
  name,
  color = "#A4CCCC",
  kanban = 0,
  companyId,
  isDefault = false
}: Request): Promise<Tag> => {
  const schema = Yup.object().shape({
    name: Yup.string().required().min(3)
  });

  try {
    await schema.validate({ name });
  } catch (err: any) {
    throw new AppError(err.message);
  }

  // Si se marca como predeterminada, desmarcar cualquier otra
  if (isDefault) {
    await Tag.update(
      { isDefault: false },
      { where: { companyId, isDefault: true } }
    );
  }

  const [tag] = await Tag.findOrCreate({
    where: { name, color, companyId, kanban },
    defaults: { name, color, companyId, kanban, isDefault }
  });

  // Si se creó y necesita ser default, actualizarlo
  if (isDefault && !tag.isDefault) {
    await tag.update({ isDefault: true });
  }

  await tag.reload();

  return tag;
};

export default CreateService;
