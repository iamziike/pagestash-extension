import BookmarkSearch from "../ui/bookmarks-search";
import CustomTabs from "../ui/custom-tabs";
import Favourites from "../ui/favourites";
import { ChevronRight } from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

const Home = () => {
  return (
    <section className="py-6">
      <header>
        <BookmarkSearch autoFocus />
      </header>
      <main className="space-y-7">
        <section className="my-3">
          <h2 className="font-extrabold text-xl">My Favourites</h2>
          <CustomTabs
            className="mt-1"
            tabs={[
              {
                content: <Favourites type="link" />,
                name: "links",
                title: "Links",
              },
              {
                content: <Favourites type="folder" />,
                name: "folders",
                title: "Folders",
              },
            ]}
          />
        </section>

        <section>
          <h2 className="font-extrabold text-xl">All Bookmarks</h2>
          <div className="mt-2 space-y-2">
            {["Google", "Pinterest", "Facebook"].map((label) => (
              <div>
                <div className="flex gap-3 items-start py-1 pb-2">
                  <div className="w-[30px] bg-orange-50 h-[26px] rounded-full"></div>
                  <div className="w-full text-ellipsis overflow-hidden">
                    <div className="w-3/4 ellipsis-text">{label}</div>
                    <div className="text-[11px] opacity-40 w-3/4 ellipsis-text">
                      github.com/microsoft/vscodesdsdsdsdnjsdjsdnjnsdjnsd
                    </div>
                  </div>
                  <div className="text-lg font-mono">→</div>
                </div>
                <Separator />
              </div>
            ))}
          </div>
          <Button className="mt-4 w-full py-5 bg-primary">
            Show All
            <span>
              <ChevronRight />
            </span>
          </Button>
        </section>

        <section>
          <h2 className="font-extrabold text-xl">Recently Visited</h2>
          <div className="mt-2 space-y-2">
            {["Google", "Pinterest"].map((label) => (
              <div>
                <div className="flex gap-3 items-start py-1 pb-2">
                  <div className="w-[30px] bg-orange-50 h-[26px] rounded-full"></div>
                  <div className="w-full text-ellipsis overflow-hidden">
                    <div className="w-3/4 ellipsis-text">{label}</div>
                    <div className="text-[11px] opacity-40 w-3/4 ellipsis-text">
                      github.com/microsoft/vscodesdsdsdsdnjsdjsdnjnsdjnsd
                    </div>
                  </div>
                  <div className="text-lg font-mono">→</div>
                </div>
                <Separator />
              </div>
            ))}
          </div>
          <Button className="mt-4 w-full py-5 bg-primary">
            Show All
            <span>
              <ChevronRight />
            </span>
          </Button>
        </section>
      </main>
    </section>
  );
};

export default Home;
