import TitleToPage from "@/app/_components/title-page";
import { SheetComponent } from "../_components/sheet";

export default async function Home() {
  return (
    <main>
      <div>
        <TitleToPage
          title="Dashboard"
          description="Acompanhe aqui seus relatórios"
        />
      </div>
      <SheetComponent />
      <div></div>
    </main>
  );
}
