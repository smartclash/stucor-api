import axios from "axios";
import cheerio from "cheerio";
import { VercelRequest, VercelResponse } from "@vercel/node";

interface BlogEntry {
  title: string;
  link: string;
}

const handler = async (_: VercelRequest, res: VercelResponse) => {
  let blogEntries: BlogEntry[] = [];
  let blogTimings = [];

  const { data } = await axios.get("https://stucor.in/category/annauniv/");
  const $ = cheerio.load(data);

  $(".p-url").each((_, element) => {
    blogEntries.push({
      title: element.attribs["title"],
      link: element.attribs["href"],
    });
  });

  $("abbr.date").each((_, element) => {
    blogTimings.push(element.attribs["title"]);
  });

  blogEntries = blogEntries.map((blog, index) => ({
    ...blog,
    time: blogTimings[index],
  }));

  res.setHeader("Cache-Control", "s-maxage=7200, stale-while-revalidate");
  return res.json(blogEntries);
};

export default handler;
