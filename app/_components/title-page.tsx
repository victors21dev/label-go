// import { UserProfileButton } from "./user-profile-button";

type TitleToPageProps = {
  title: string;
  description: string;
};

const TitleToPage = ({ title, description }: TitleToPageProps) => {
  return (
    <header className="w-full flex justify-between items-center py-4">
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {/* <div className="flex items-center gap-4">
        <UserProfileButton />
      </div> */}
    </header>
  );
};

export default TitleToPage;
