import DashboardLayout from "../_components/dashboard";
import { getDashboardData } from "@/app/_actions/get-dashboard-data";

export default async function Home() {
  const data = await getDashboardData();
  return (
    <main>
      <DashboardLayout initialData={data} />
    </main>
  );
}
