interface Props {
  type: "link" | "folder";
}

const Favourites = ({ type }: Props) => {
  if (type === "link") {
    return (
      <div className="grid grid-cols-2 gap-3 text-center overflow-auto">
        <div className="bg-secondary h-20 rounded-md flex justify-center items-center">
          Facebook
        </div>
        <div className="bg-secondary h-20 rounded-md flex justify-center items-center">
          Google
        </div>
        <div className="bg-secondary h-20 rounded-md flex justify-center items-center">
          Snapchat
        </div>
        <div className="bg-secondary h-20 rounded-md flex justify-center items-center">
          TikTok
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 text-center overflow-auto">
      <div className="bg-secondary h-20 rounded-md flex justify-center items-center">
        Startup
      </div>
      <div className="bg-secondary h-20 rounded-md flex justify-center items-center">
        Productivity
      </div>
      <div className="bg-secondary h-20 rounded-md flex justify-center items-center">
        Design
      </div>
      <div className="bg-secondary h-20 rounded-md flex justify-center items-center">
        Art
      </div>
    </div>
  );
};

export default Favourites;
