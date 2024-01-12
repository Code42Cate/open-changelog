import RSS from "rss";
import { getLocalChangelog } from "../logs";
import { config } from "@/config.changelog";

export async function GET() {
  const feed = new RSS({
    title: config.title,
    description: config.description,
    site_url: config.baseUrl,
    feed_url: `${config.baseUrl}/feed.xml`,
  });

  const logs = await getLocalChangelog();

  logs.forEach((log) => {
    feed.item({
      title: log.attributes["title"],
      url: `${config.baseUrl}?p=${log.date}`,
      date: log.date,
      description: log.attributes["summmary"],
      author: config.author,
      categories: log.attributes["tags"],
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}
