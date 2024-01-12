"use server";
import fm from "front-matter";
import { readFileSync, readdirSync } from "fs";

export async function getLocalChangelog() {
  const files = readdirSync("data")
    .filter((file) => file.match(/\d{4}-\d{2}-\d{2}\.mdx/))
    .sort((a, b) => {
      const [aDate] = a.split(".");
      const [bDate] = b.split(".");
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  const data = files.map((file) => {
    const [date] = file.split(".");
    const { attributes, body } = fm(readFileSync(`data/${file}`, "utf-8"));
    return { date, body, attributes };
  });

  return data;
}
