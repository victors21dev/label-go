import { db } from "../_lib/prisma";

type CheckUserProps = {
  id: string;
};

const checkUser = async ({ id }: CheckUserProps) => {
  const user = await db.user.findUnique({
    where: {
      id: id,
    },
  });

  return user;
};

export default checkUser;
