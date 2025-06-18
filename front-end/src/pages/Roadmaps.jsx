import { use, useEffect, useState } from "react";
import { useGetRoadmaps } from "../hooks/courses/useGetRoadmaps";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Loader from "../ui/Loader";

function Roadmaps() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(category || "all");
  const {
    roadmaps: { categories, roadmaps } = {},
    isLoading,
    error,
  } = useGetRoadmaps();
  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory("all");
    }
  }, [category]);

  function handleCategoryClick(category) {
    setSelectedCategory(category);
  }

  const filteredRoadmaps =
    selectedCategory === "all"
      ? roadmaps
      : roadmaps?.filter((roadmap) => roadmap.category === selectedCategory);

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto p-8">
        <div className="space-y-12">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              className={`transform rounded-full px-6 py-3 text-sm font-medium shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                selectedCategory === "all"
                  ? "bg-primary-600 shadow-primary-600/50 text-white"
                  : "bg-footer-800/80 text-footer-300 hover:bg-footer-700 hover:text-white"
              }`}
              onClick={() => handleCategoryClick("all")}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`transform rounded-full bg-white/5 p-6 px-6 py-3 text-sm font-medium shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl ${
                  selectedCategory === category
                    ? "bg-primary-600 shadow-primary-600/50 text-white"
                    : "bg-footer-800/80 text-footer-300 hover:bg-footer-700 hover:text-white"
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="h-[calc(100vh-16rem)] overflow-y-auto p-4">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredRoadmaps.map((roadmap) => (
                <Link
                  to={`/roadmaps/${roadmap._id}`}
                  key={roadmap._id}
                  className="group hover:shadow-primary-600/20 relative overflow-hidden rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:shadow-xl"
                >
                  <div className="from-primary-600/10 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="h-40 w-40 overflow-hidden rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-105">
                      <img
                        src={roadmap.image}
                        alt={roadmap.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <h3 className="mt-6 text-center text-xl font-bold text-white">
                      {roadmap.title}
                    </h3>
                    <div className="bg-primary-600/20 text-primary-400 mt-4 transform rounded-full px-4 py-1 text-sm opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      View Roadmap
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Roadmaps;
