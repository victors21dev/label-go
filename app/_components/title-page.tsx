import { UserButton } from "@clerk/nextjs";

type TitleToPageProps = {
  title: string;
  description: string;
};

const TitleToPage = ({ title, description }: TitleToPageProps) => {
  return (
    <header className="w-full flex justify-between">
      <div>
        <div className="text-lg font-bold">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <div>
        <UserButton />
      </div>
    </header>
  );
};

export default TitleToPage;
