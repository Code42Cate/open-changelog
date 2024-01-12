import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/components/accordion";
import { readFileSync, readdirSync } from "fs";
import { MDXRemote } from "next-mdx-remote/rsc";
import fm from "front-matter";

const tagColors = {
  new: "bg-emerald-200 text-emerald-900",
  improved: "bg-sky-200 text-sky-900",
  fixed: "bg-amber-200 text-amber-900",
};

function getLocalChangelog() {
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

export default async function Page() {
  const changelog = getLocalChangelog();

  return (
    <main className="mx-auto flex max-w-4xl flex-col rounded-xl border border-neutral-300 bg-white p-4 shadow-sm">
      <h1 className="text-3xl font-bold">Changelog</h1>
      <div className="pt-2 text-sm text-neutral-700">
        Follow up on the latest improvements and updates.
      </div>
      <div className="flex flex-col pt-8">
        {changelog.map(({ date, attributes, body }) => (
          <div
            className="flex flex-row gap-4 border-t border-neutral-300 py-8"
            key={`${date}-${attributes["title"]}`}
          >
            <div className="hidden w-52 shrink-0 leading-8 text-neutral-700 md:block">
              {new Date(date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <Accordion type="single" collapsible>
              <AccordionItem value={`${date}-${attributes["title"]}`}>
                <AccordionTrigger className="flex flex-col items-start justify-start gap-1 text-left hover:no-underline">
                  <h3 className="text-2xl font-semibold hover:cursor-pointer">
                    {attributes["title"]}
                  </h3>
                  <div className="w-52 shrink-0 text-sm leading-8 text-neutral-700 md:hidden">
                    {new Date(date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>

                  <div className="flex flex-row gap-1.5">
                    {attributes["tags"]?.map((tag: string) => (
                      <span
                        key={tag}
                        className={`rounded-lg px-2 py-1 text-xs ${tagColors[tag]}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="pt-2 text-sm text-neutral-800">
                    {attributes["summary"]}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-2 text-sm text-neutral-500">
                    {/* @ts-expect-error Server Component */}
                    <MDXRemote source={body} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>
    </main>
  );
}
