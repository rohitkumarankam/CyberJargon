"use client";

import { useState, useEffect } from "react";
import client from "@/lib/meilisearch";
import { Input } from "@/components/ui/input";

interface Acronym {
  acronym: string;
  meaning: string;
  shortDescription: string;
  LongDescription: string;
  References: { title: string; url: string }[];
  Related: { title: string; url: string }[];
}

export function MeilisearchView() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTerm, setSelectedTerm] = useState<Acronym | null>(null);
  const [terms, setTerms] = useState<Acronym[]>([]);

  useEffect(() => {
    const fetchTerms = async () => {
      if (searchTerm.trim() === "") {
        setTerms([]);
        return;
      }

      const index = client.index("jargon"); // Replace 'jargon' with your Meilisearch index name
      const searchResults = await index.search<Acronym>(searchTerm);
      setTerms(Array.isArray(searchResults.hits) ? searchResults.hits : []);
    };

    fetchTerms();
  }, [searchTerm]);

  const handleTermSelect = (term: Acronym) => {
    setSelectedTerm(term);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <h1 className="text-2xl font-bold">CyberJargon</h1>
      </header>
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
          {Array.isArray(terms) && terms.length > 0 ? (
            <div className="grid gap-6">
              {terms.map((term) => (
                <div
                  key={term.acronym} // Use term.acronym or another unique key
                  className="bg-card p-6 rounded-lg shadow-lg cursor-pointer hover:bg-card-hover"
                  onClick={() => handleTermSelect(term)}
                >
                  <h2 className="text-xl font-bold mb-2 inline">{term.acronym+":"}</h2>
                  <p className="text-muted-foreground mb-4 inline pl-1">{term.meaning}</p>
                  <p className="text-muted-foreground mb-4 py-1">{term.shortDescription}</p>
                  {selectedTerm?.acronym === term.acronym && (
                    <div>
                      <p className="mb-4">{term.LongDescription}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 text-muted-foreground text-sm">
                          Related Terms:
                        </span>
                        {term.Related.map((relatedTerm, index) => (
                          <span key={index} className="bg-muted px-2 py-1 rounded-full text-muted-foreground text-sm">
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
            <div className="text-center text-muted-foreground">No terms found.</div>
          )}
          
        </div>
      </div>
    </div>
  );
}
