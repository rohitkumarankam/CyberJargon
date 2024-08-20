"use client";
import { useState, useEffect } from "react";
import client from "@/lib/meilisearch";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator"


interface Acronym {
  acronym: string;
  meaning: string;
  shortDescription: string;
  LongDescription: string;
  References: { title: string; url: string }[];
  Related: { title: string; url: string }[];
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[30px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-[50px] rounded-xl" />
      </div>
    </div>
  );
}

export function MeilisearchView() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTerm, setSelectedTerm] = useState<Acronym | null>(null);
  const [terms, setTerms] = useState<Acronym[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTerms = async () => {
      if (searchTerm.trim() === "") {
        setTerms([]);
        return;
      }

      setLoading(true);

      const index = client.index("jargon");
      const searchResults = await index.search<Acronym>(searchTerm);
      setTerms(Array.isArray(searchResults.hits) ? searchResults.hits : []);

      setLoading(false);
    };

    fetchTerms();
  }, [searchTerm]);

  const handleTermSelect = (term: Acronym) => {
    setSelectedTerm(term);
  };

  return (
    <div className="flex-1 bg-background p-6 overflow-auto">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Input
            type="search"
            placeholder="Search for a term..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        {loading ? (
          <SkeletonCard />
        ) : Array.isArray(terms) && terms.length > 0 ? (
          <div className="grid gap-6">
            {terms.map((term) => (
              <div
                key={term.acronym}
                className="bg-card border-2 border-gray p-6 bg-color-foreground rounded-lg shadow-lg cursor-pointer hover:bg-card-hover"
                onClick={() => handleTermSelect(term)}
              >
                <h2 className="text-xl font-bold mb-2 inline">
                  {term.acronym + ":"}
                </h2>
                <p className="text-muted-foreground inline pl-1">
                  {term.meaning}
                </p>
                <p className="text-muted-foreground py-1">
                  {term.shortDescription}
                </p>
                {selectedTerm?.acronym === term.acronym && (
                  <div>
                    <Separator className="mb-4"/>
                    <p className="mb-4">{term.LongDescription}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-muted-foreground text-sm">
                        Related Terms:
                      </span>
                      {term.Related.map((relatedTerm, index) => (
                        <span
                          key={index}
                          className="bg-muted px-2 py-1 rounded-full text-muted-foreground text-sm"
                        >
                          {relatedTerm.title}
                        </span>
                      ))}
                    </div>
                    <div className="py-2">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 text-muted-foreground text-sm">
                          References:
                        </span>
                        {term.References.map((reference, index) => (
                          <a
                            key={index}
                            href={reference.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-muted px-2 py-1 rounded-full text-muted-foreground text-sm"
                          >
                            {reference.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground pt-9">
            No terms found.
          </div>
        )}
      </div>
    </div>
  );
}
