type TitleToPageProps = {
  title: string;
  description: string;
};

const TitleToPage = ({ title, description }: TitleToPageProps) => {
  return (
    <header>
      <div className="text-lg font-bold">{title}</div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </header>
  );
};

export default TitleToPage;
