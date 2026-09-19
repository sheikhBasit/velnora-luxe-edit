import { createFileRoute, Link } from "@tanstack/react-router";
import { listBlogs, type Blog } from "@/lib/blogs.server";
import { Header } from "@/components/velnora/Header";
import { Footer } from "@/components/velnora/Footer";
import { Fragment } from "react";

export const Route = createFileRoute("/tutorial/")({
  component: TutorialIndex,
  loader: async () => {
    const allBlogs = await listBlogs({ data: { type: 'tutorial' } });
    return { tutorials: allBlogs.filter(t => t.published) };
  },
});

function TutorialIndex() {
  const { tutorials } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <header className="mb-16 text-center">
            <h1 className="font-serif text-4xl tracking-wide md:text-5xl">TUTORIALS & HOW-TOS</h1>
            <p className="mt-4 text-muted-foreground uppercase tracking-widest text-sm">
              Step-by-step guides for your beauty rituals
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {tutorials.map((tutorial: Blog) => (
              <Fragment key={tutorial.id}>
                <article className="group flex flex-col space-y-4">
                  <Link to="/tutorial/$slug" params={{ slug: tutorial.slug }} className="block overflow-hidden rounded-sm aspect-[4/3]">
                    <img
                      src={tutorial.coverImage || "/placeholder.svg"}
                      alt={tutorial.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {tutorial.steps.length} Steps
                    </p>
                    <h2 className="font-serif text-xl tracking-wide group-hover:underline">
                      <Link to="/tutorial/$slug" params={{ slug: tutorial.slug }}>
                        {tutorial.title}
                      </Link>
                    </h2>
                  </div>
                </article>
              </Fragment>
            ))}
          </div>

          {tutorials.length === 0 && (
            <div className="text-center py-24 text-muted-foreground">
              <p>No tutorials published yet.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
