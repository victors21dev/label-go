import TitleToPage from "@/app/_components/title-page";
import DashboardLayout from "../_components/dashboard";
import { getDashboardData } from "@/app/_actions/get-dashboard-data";

export default async function Home() {
  const data = await getDashboardData();
  return (
    <main>
      <div>
        <TitleToPage
          title="Dashboard"
          description="Acompanhe aqui seus relatórios"
        />
      </div>
      <div>
        <DashboardLayout initialData={data} />
      </div>
    </main>
  );
}
