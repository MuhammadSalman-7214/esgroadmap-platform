import { TargetSentenceData } from "@/functions/target";

export const mockCarbonData: TargetSentenceData[] = [
  // Basic Data Display and Sorting
  {
    ID: "1",
    Company: "Acme Corp",
    DocURL: "https://acme.com/report",
    "Target Sentence": "Reduce carbon emissions by 50% by 2030",
    "Target Year(s)": "2030",
    Country: "USA",
    "sector code #1 (NAICS)": "12345",
    "sector name #1 (NAICS)": "Technology",
    "Upload Date": "2024-03-15",
  },
  {
    ID: "2",
    Company: "Beta Industries",
    DocURL: "https://beta.com/report",
    "Target Sentence": "Achieve net-zero emissions by 2040",
    "Target Year(s)": "2040",
    Country: "Canada",
    "sector code #1 (NAICS)": "67890",
    "sector name #1 (NAICS)": "Manufacturing",
    "Upload Date": "2024-03-10",
  },
  {
    ID: "3",
    Company: "Acme Corp",
    DocURL: "https://acme.com/another-report",
    "Target Sentence": "Increase renewable energy use to 75% by 2035",
    "Target Year(s)": "2035",
    Country: "USA",
    "sector code #1 (NAICS)": "12345",
    "sector name #1 (NAICS)": "Technology",
    "Upload Date": "2024-03-20",
  },
  {
    ID: "4",
    Company: "Gamma Solutions",
    DocURL: "https://gamma.com/report",
    "Target Sentence":
      "This is a very long target sentence that will be truncated in the table but should be fully displayed in the modal when clicked. It aims to test the functionality of the modal and ensure that long text is handled correctly.",
    "Target Year(s)": "2045",
    Country: "UK",
    "sector code #1 (NAICS)": "54321",
    "sector name #1 (NAICS)": "Finance",
    "Upload Date": "2024-03-18",
  },
  {
    ID: "5",
    Company: "Delta Co",
    DocURL: "https://delta.com/report",
    "Target Sentence": "Improve water efficiency by 30% by 2025",
    "Target Year(s)": "2025",
    Country: "Australia",
    "sector code #1 (NAICS)": "98765",
    "sector name #1 (NAICS)": "Mining",
    "Upload Date": "2024-03-22",
  },
  // Filtering - Global Filter
  {
    ID: "6",
    Company: "Global Filter Test Inc.",
    DocURL: "https://globalfilter.com/report",
    "Target Sentence": "This sentence contains the keyword filter.",
    "Target Year(s)": "2032",
    Country: "USA",
    "sector code #1 (NAICS)": "11111",
    "sector name #1 (NAICS)": "Agriculture",
    "Upload Date": "2024-03-25",
  },
  // Filtering - Company (MultiSelect)
  {
    ID: "7",
    Company: "Acme Corp",
    DocURL: "https://acme.com/report-3",
    "Target Sentence": "Another target for Acme Corp",
    "Target Year(s)": "2033",
    Country: "USA",
    "sector code #1 (NAICS)": "12345",
    "sector name #1 (NAICS)": "Technology",
    "Upload Date": "2024-03-28",
  },
  {
    ID: "8",
    Company: "Beta Industries",
    DocURL: "https://beta.com/report-2",
    "Target Sentence": "Another target for Beta Industries",
    "Target Year(s)": "2042",
    Country: "Canada",
    "sector code #1 (NAICS)": "67890",
    "sector name #1 (NAICS)": "Manufacturing",
    "Upload Date": "2024-03-29",
  },
  // Filtering - Target_sentence (Contains)
  {
    ID: "9",
    Company: "Partial Sentence Test",
    DocURL: "https://partial.com/report",
    "Target Sentence": "This sentence contains the word emissions.",
    "Target Year(s)": "2036",
    Country: "Germany",
    "sector code #1 (NAICS)": "22222",
    "sector name #1 (NAICS)": "Energy",
    "Upload Date": "2024-03-30",
  },
  // Filtering - SentenceTargetYear (Contains)
  {
    ID: "10",
    Company: "Year Filter Test",
    DocURL: "https://yearfilter.com/report",
    "Target Sentence": "Target for the year 2030",
    "Target Year(s)": "2030",
    Country: "France",
    "sector code #1 (NAICS)": "33333",
    "sector name #1 (NAICS)": "Construction",
    "Upload Date": "2024-04-02",
  },
  // Filtering - Country (MultiSelect)
  {
    ID: "11",
    Company: "Country Filter Test",
    DocURL: "https://countryfilter.com/report",
    "Target Sentence": "Target for companies in the USA",
    "Target Year(s)": "2038",
    Country: "USA",
    "sector code #1 (NAICS)": "44444",
    "sector name #1 (NAICS)": "Retail",
    "Upload Date": "2024-04-05",
  },
  {
    ID: "12",
    Company: "Another Country Test",
    DocURL: "https://countrytest.com/report",
    "Target Sentence": "Target for companies in Canada",
    "Target Year(s)": "2041",
    Country: "Canada",
    "sector code #1 (NAICS)": "55555",
    "sector name #1 (NAICS)": "Healthcare",
    "Upload Date": "2024-04-08",
  },
  // Filtering - sector_code__1__NAICS_ (MultiSelect)
  {
    ID: "13",
    Company: "Sector Code Test",
    DocURL: "https://sectorcode.com/report",
    "Target Sentence": "Target for sector code 12345",
    "Target Year(s)": "2039",
    Country: "Japan",
    "sector code #1 (NAICS)": "12345",
    "sector name #1 (NAICS)": "Technology",
    "Upload Date": "2024-04-10",
  },
  {
    ID: "14",
    Company: "Another Sector Code Test",
    DocURL: "https://sectorcodetest.com/report",
    "Target Sentence": "Target for sector code 67890",
    "Target Year(s)": "2043",
    Country: "South Korea",
    "sector code #1 (NAICS)": "67890",
    "sector name #1 (NAICS)": "Manufacturing",
    "Upload Date": "2024-04-12",
  },
  // Filtering - sector_name__1__NAICS_ (MultiSelect)
  {
    ID: "15",
    Company: "Sector Name Test",
    DocURL: "https://sectorname.com/report",
    "Target Sentence": "Target for the Technology sector",
    "Target Year(s)": "2037",
    Country: "Singapore",
    "sector code #1 (NAICS)": "11111",
    "sector name #1 (NAICS)": "Technology",
    "Upload Date": "2024-04-15",
  },
  {
    ID: "16",
    Company: "Another Sector Name Test",
    DocURL: "https://sectornametest.com/report",
    "Target Sentence": "Target for the Manufacturing sector",
    "Target Year(s)": "2044",
    Country: "India",
    "sector code #1 (NAICS)": "22222",
    "sector name #1 (NAICS)": "Manufacturing",
    "Upload Date": "2024-04-18",
  },
  // Filtering - upload_date (Contains)
  {
    ID: "17",
    Company: "Upload Date Test",
    DocURL: "https://uploaddate.com/report",
    "Target Sentence": "Target uploaded on 2024-03-15",
    "Target Year(s)": "2040",
    Country: "Brazil",
    "sector code #1 (NAICS)": "33333",
    "sector name #1 (NAICS)": "Energy",
    "Upload Date": "2024-03-15",
  },
  {
    ID: "18",
    Company: "Another Upload Date Test",
    DocURL: "https://uploaddatetest.com/report",
    "Target Sentence": "Target uploaded in March 2024",
    "Target Year(s)": "2046",
    Country: "Mexico",
    "sector code #1 (NAICS)": "44444",
    "sector name #1 (NAICS)": "Retail",
    "Upload Date": "2024-03-28",
  },
  // Combined Filters
  {
    ID: "19",
    Company: "Acme Corp",
    DocURL: "https://acme.com/report-4",
    "Target Sentence": "Reduce emissions by 60% by 2030 (USA)",
    "Target Year(s)": "2030",
    Country: "USA",
    "sector code #1 (NAICS)": "12345",
    "sector name #1 (NAICS)": "Technology",
    "Upload Date": "2024-03-15", // Match with ID 17
  },
  {
    ID: "20",
    Company: "Beta Industries",
    DocURL: "https://beta.com/report-3",
    "Target Sentence": "Achieve net-zero emissions by 2040 (Canada)",
    "Target Year(s)": "2040",
    Country: "Canada",
    "sector code #1 (NAICS)": "67890",
    "sector name #1 (NAICS)": "Manufacturing",
    "Upload Date": "2024-03-10", // Match with ID 2
  },
  // Edge Cases
  {
    ID: "21",
    Company: "Null Values Test",
    DocURL: "https://nullvalues.com/report",
    "Target Sentence": "Target with some null values",
    "Target Year(s)": null,
    Country: null,
    "sector code #1 (NAICS)": null,
    "sector name #1 (NAICS)": null,
    "Upload Date": "2024-04-20",
  },
  {
    ID: "22",
    Company: "Long String Test",
    DocURL: "https://longstring.com/report",
    "Target Sentence":
      "This is an extremely long target sentence designed to test how the table handles very long strings in different columns. It should be truncated appropriately in the table cell and fully displayed in the modal when clicked.",
    "Target Year(s)": "2050",
    Country: "Very Long Country Name",
    "sector code #1 (NAICS)": "1234567890",
    "sector name #1 (NAICS)": "Extremely Long Sector Name",
    "Upload Date": "2024-04-22",
  },
  // Add more mock data as needed for other test cases...
  // Make sure you have at least 20-30 rows for pagination testing.
];

export const getMockSentenceCarbonData = async (): Promise<
  TargetSentenceData[]
> => {
  return new Promise((resolve) => {
    // Simulate a small delay to mimic network request
    setTimeout(() => {
      resolve(mockCarbonData);
    }, 500);
  });
}; 