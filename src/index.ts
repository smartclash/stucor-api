import cheerio from "cheerio";
import axios from "axios";

const scrapeData = async () => {
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

  return blogEntries.map((blog, index) => ({
    ...blog,
    time: blogTimings[index],
  }));
};

scrapeData().then(console.log).catch(console.error);
