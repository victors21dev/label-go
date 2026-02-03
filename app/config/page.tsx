import TitleToPage from "../_components/title-page";

const Config = () => {
  return (
    <main>
      <div>
        <TitleToPage
          title="Configuração"
          description="Faça suas configurações aqui"
        />
      </div>
      <div className="flex flex-col mt-4">
        <h1>Configuração da etiqueta</h1>
        <div></div>
      </div>
    </main>
  );
};

export default Config;
