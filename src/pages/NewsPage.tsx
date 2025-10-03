import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type NewsItem = {
  title: string;
  url: string;
  description: string;
  publishedAt: string;
};

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [hoveredNews, setHoveredNews] = useState<NewsItem | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(
          "https://saurav.tech/NewsAPI/top-headlines/category/general/us.json"
        );
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        const items: NewsItem[] = (data.articles || []).map((a: any) => ({
          title: a.title,
          url: a.url,
          description: a.description || "",
          publishedAt: a.publishedAt || a.published_at || "",
        }));
        setNews(items);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div className="p-4">Loading news...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading news: {error}</div>;

  return (
    <div className="w-full h-[500px] overflow-y-auto pr-3 custom-scrollbar relative">
      <h1 className="text-lg font-bold mb-3 ml-4 mt-2 text-yellow-400">Latest News</h1>

      <div className="space-y-1">
        {news.map((item, idx) => (
          <div
            key={idx}
            className="py-2 px-4 bg-gray-800 rounded shadow cursor-pointer relative"
            onMouseEnter={() => setHoveredNews(item)}
            onMouseLeave={() => setHoveredNews(null)}
            onMouseMove={(e) => setMousePos({ x: e.clientX + 10, y: e.clientY + 10 })}
          >
            <span className="text-sm font-semibold text-white hover:underline">
              {item.title}
            </span>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
            <div className="text-xs text-gray-500 mt-2">
              {item.publishedAt ? new Date(item.publishedAt).toLocaleString() : ""}
            </div>
          </div>
        ))}
      </div>

      {/* Hover popup using portal */}
      {hoveredNews &&
        createPortal(
          <div
            className="absolute z-50 w-72 p-3 bg-yellow-400 text-black rounded shadow-lg pointer-events-auto"
            style={{ top: mousePos.y, left: mousePos.x }}
          >
            <h3 className="font-bold text-sm">{hoveredNews.title}</h3>
            <p className="text-xs mt-1">{hoveredNews.description}</p>
            <p className="text-[10px] text-gray-700 mt-1">
              {hoveredNews.publishedAt
                ? new Date(hoveredNews.publishedAt).toLocaleString()
                : ""}
            </p>
            <a
              href={hoveredNews.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 text-xs mt-2 block hover:underline"
            >
              Read full article →
            </a>
          </div>,
          document.body
        )}
    </div>
  );
};

export default NewsPage;
