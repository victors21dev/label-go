import { db } from "@/app/_lib/prisma";
import HistoryClient from "@/app/_components/history-client";

const History = async () => {
  const dataSector = await db.labelGeneration.findMany({
    include: {
      sector: true,
      user: true,
      labelModel: true,
      printer: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main>
      <HistoryClient initialData={dataSector} />
    </main>
  );
};

export default History;
