import TitleToPage from "@/app/_components/title-page";

export default async function Home() {
  return (
    <main>
      <div>
        <TitleToPage
          title="Dashboard"
          description="Acompanhe aqui seus relatórios"
        />
      </div>
      <div></div>
    </main>
  );
}
