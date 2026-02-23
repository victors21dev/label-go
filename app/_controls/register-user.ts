import { db } from "../_lib/prisma";

type RegisterUserProps = {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
};

const registerUser = async ({
  id,
  name,
  email,
  imageUrl,
}: RegisterUserProps) => {
  const newUser = await db.user.create({
    data: {
      id: id,
      name: name,
      imageUrl: imageUrl,
      email: email,
      role: "USER",
      status: "UNAUTHORIZED",
      sectorId: null,
    },
  });

  return newUser;
};

export default registerUser;
