import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/components/accordion";
import { MDXRemote } from "next-mdx-remote/rsc";
import { RssIcon } from "lucide-react";
import Link from "next/link";
import { getLocalChangelog } from "./logs";
import { config } from "@/config.changelog";

const tagColors = {
  new: "bg-emerald-200 text-emerald-900",
  improved: "bg-sky-200 text-sky-900",
  fixed: "bg-amber-200 text-amber-900",
};

export default async function Page() {
  const changelog = await getLocalChangelog();

  return (
    <main className="mx-auto flex max-w-4xl flex-col rounded-xl border border-neutral-300 bg-white p-4 shadow-sm">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-3xl font-bold">{config.title}</h1>
        <Link href="/feed.xml" prefetch={false} target="_blank" rel="noopener">
          <span aria-hidden className="sr-only">
            RSS Feed
          </span>
          <RssIcon className="h-6 w-6 text-neutral-700 hover:text-neutral-900" />
        </Link>
      </div>
      <div className="pt-2 text-sm text-neutral-700">{config.description}</div>
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
