import useRecentlyVisited from "@/sidepanel/hooks/useRecentlyVisited";
import useBookmark, { bookmarkHelpers } from "@/sidepanel/store/useBookmark";
import Favourites from "../ui/pages/favourites/favourites";
import CustomSearch from "../ui/custom-search";
import HomeLink from "../ui/pages/home/home-link";
import { ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PAGES } from "@/constants";
import { RecentlyVisitedLink } from "@/models";

const Home = () => {
  const navigate = useNavigate();
  const { bookmark } = useBookmark();
  const { getRecentlyVisited } = useRecentlyVisited();
  const [recentlyVisitedLinks, setRecentlyVisitedLinks] = useState<
    RecentlyVisitedLink[]
  >([]);

  const fetchRecentlyVisitedLinks = useCallback(async () => {
    const response = await getRecentlyVisited({ query: "", maxResults: 3 });
    setRecentlyVisitedLinks(response);
  }, [getRecentlyVisited]);

  useEffect(() => {
    fetchRecentlyVisitedLinks();
  }, [fetchRecentlyVisitedLinks]);

  return (
    <section className="py-6">
      <header>
        <CustomSearch
          placeholder="Search for Bookmarks..."
          handleSubmit={({ query }) => {
            if (query) {
              const searchParams = new URLSearchParams();
              searchParams.set("query", query);
              navigate(`${PAGES.BOOKMARKS.path}?${searchParams.toString()}`);
            }
          }}
        />
      </header>
      <main className="space-y-7">
        <section className="my-3">
          <Favourites />
        </section>

        <section className="my-3">
          <h2 className="font-extrabold text-xl">All Bookmarks</h2>
          <div className="mt-2 space-y-2">
            {bookmarkHelpers
              .getAllBookmarkLinks(bookmark, { maxLimit: 5 })
              .map(({ url, id, title }) => (
                <HomeLink key={id} title={title} url={url} />
              ))}
          </div>
          <Link to={PAGES.BOOKMARKS.path} className="button">
            Show All
            <span>
              <ChevronRight />
            </span>
          </Link>
        </section>

        <section>
          <h2 className="font-extrabold text-xl">Recently Visited</h2>
          <div className="mt-2 space-y-2">
            {recentlyVisitedLinks?.map(({ title, url, id }) => (
              <HomeLink key={id} title={title} url={url} />
            ))}
          </div>
          <Link to={PAGES.RECENTLY_VISITED.path} className="button">
            Show All
            <span>
              <ChevronRight />
            </span>
          </Link>
        </section>
      </main>
    </section>
  );
};

export default Home;
