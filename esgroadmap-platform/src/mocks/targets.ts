import { TargetSentenceData } from "@/functions/target";

export const mockCarbonData: TargetSentenceData[] = [
  // Basic Data Display and Sorting
  {
    id: "1",
    Company: "Acme Corp",
    DocURL: "https://acme.com/report",
    Target_sentence: "Reduce carbon emissions by 50% by 2030",
    SentenceTargetYear: "2030",
    Country: "USA",
    sector_code__1__NAICS_: "12345",
    sector_name__1__NAICS_: "Technology",
    upload_date: "2024-03-15",
  },
  {
    id: "2",
    Company: "Beta Industries",
    DocURL: "https://beta.com/report",
    Target_sentence: "Achieve net-zero emissions by 2040",
    SentenceTargetYear: "2040",
    Country: "Canada",
    sector_code__1__NAICS_: "67890",
    sector_name__1__NAICS_: "Manufacturing",
    upload_date: "2024-03-10",
  },
  {
    id: "3",
    Company: "Acme Corp",
    DocURL: "https://acme.com/another-report",
    Target_sentence: "Increase renewable energy use to 75% by 2035",
    SentenceTargetYear: "2035",
    Country: "USA",
    sector_code__1__NAICS_: "12345",
    sector_name__1__NAICS_: "Technology",
    upload_date: "2024-03-20",
  },
  {
    id: "4",
    Company: "Gamma Solutions",
    DocURL: "https://gamma.com/report",
    Target_sentence:
      "This is a very long target sentence that will be truncated in the table but should be fully displayed in the modal when clicked. It aims to test the functionality of the modal and ensure that long text is handled correctly.",
    SentenceTargetYear: "2045",
    Country: "UK",
    sector_code__1__NAICS_: "54321",
    sector_name__1__NAICS_: "Finance",
    upload_date: "2024-03-18",
  },
  {
    id: "5",
    Company: "Delta Co",
    DocURL: "https://delta.com/report",
    Target_sentence: "Improve water efficiency by 30% by 2025",
    SentenceTargetYear: "2025",
    Country: "Australia",
    sector_code__1__NAICS_: "98765",
    sector_name__1__NAICS_: "Mining",
    upload_date: "2024-03-22",
  },
  // Filtering - Global Filter
  {
    id: "6",
    Company: "Global Filter Test Inc.",
    DocURL: "https://globalfilter.com/report",
    Target_sentence: "This sentence contains the keyword filter.",
    SentenceTargetYear: "2032",
    Country: "USA",
    sector_code__1__NAICS_: "11111",
    sector_name__1__NAICS_: "Agriculture",
    upload_date: "2024-03-25",
  },
  // Filtering - Company (MultiSelect)
  {
    id: "7",
    Company: "Acme Corp",
    DocURL: "https://acme.com/report-3",
    Target_sentence: "Another target for Acme Corp",
    SentenceTargetYear: "2033",
    Country: "USA",
    sector_code__1__NAICS_: "12345",
    sector_name__1__NAICS_: "Technology",
    upload_date: "2024-03-28",
  },
  {
    id: "8",
    Company: "Beta Industries",
    DocURL: "https://beta.com/report-2",
    Target_sentence: "Another target for Beta Industries",
    SentenceTargetYear: "2042",
    Country: "Canada",
    sector_code__1__NAICS_: "67890",
    sector_name__1__NAICS_: "Manufacturing",
    upload_date: "2024-03-29",
  },
  // Filtering - Target_sentence (Contains)
  {
    id: "9",
    Company: "Partial Sentence Test",
    DocURL: "https://partial.com/report",
    Target_sentence: "This sentence contains the word emissions.",
    SentenceTargetYear: "2036",
    Country: "Germany",
    sector_code__1__NAICS_: "22222",
    sector_name__1__NAICS_: "Energy",
    upload_date: "2024-03-30",
  },
  // Filtering - SentenceTargetYear (Contains)
  {
    id: "10",
    Company: "Year Filter Test",
    DocURL: "https://yearfilter.com/report",
    Target_sentence: "Target for the year 2030",
    SentenceTargetYear: "2030",
    Country: "France",
    sector_code__1__NAICS_: "33333",
    sector_name__1__NAICS_: "Construction",
    upload_date: "2024-04-02",
  },
  // Filtering - Country (MultiSelect)
  {
    id: "11",
    Company: "Country Filter Test",
    DocURL: "https://countryfilter.com/report",
    Target_sentence: "Target for companies in the USA",
    SentenceTargetYear: "2038",
    Country: "USA",
    sector_code__1__NAICS_: "44444",
    sector_name__1__NAICS_: "Retail",
    upload_date: "2024-04-05",
  },
  {
    id: "12",
    Company: "Another Country Test",
    DocURL: "https://countrytest.com/report",
    Target_sentence: "Target for companies in Canada",
    SentenceTargetYear: "2041",
    Country: "Canada",
    sector_code__1__NAICS_: "55555",
    sector_name__1__NAICS_: "Healthcare",
    upload_date: "2024-04-08",
  },
  // Filtering - sector_code__1__NAICS_ (MultiSelect)
  {
    id: "13",
    Company: "Sector Code Test",
    DocURL: "https://sectorcode.com/report",
    Target_sentence: "Target for sector code 12345",
    SentenceTargetYear: "2039",
    Country: "Japan",
    sector_code__1__NAICS_: "12345",
    sector_name__1__NAICS_: "Technology",
    upload_date: "2024-04-10",
  },
  {
    id: "14",
    Company: "Another Sector Code Test",
    DocURL: "https://sectorcodetest.com/report",
    Target_sentence: "Target for sector code 67890",
    SentenceTargetYear: "2043",
    Country: "South Korea",
    sector_code__1__NAICS_: "67890",
    sector_name__1__NAICS_: "Manufacturing",
    upload_date: "2024-04-12",
  },
  // Filtering - sector_name__1__NAICS_ (MultiSelect)
  {
    id: "15",
    Company: "Sector Name Test",
    DocURL: "https://sectorname.com/report",
    Target_sentence: "Target for the Technology sector",
    SentenceTargetYear: "2037",
    Country: "Singapore",
    sector_code__1__NAICS_: "11111",
    sector_name__1__NAICS_: "Technology",
    upload_date: "2024-04-15",
  },
  {
    id: "16",
    Company: "Another Sector Name Test",
    DocURL: "https://sectornametest.com/report",
    Target_sentence: "Target for the Manufacturing sector",
    SentenceTargetYear: "2044",
    Country: "India",
    sector_code__1__NAICS_: "22222",
    sector_name__1__NAICS_: "Manufacturing",
    upload_date: "2024-04-18",
  },
  // Filtering - upload_date (Contains)
  {
    id: "17",
    Company: "Upload Date Test",
    DocURL: "https://uploaddate.com/report",
    Target_sentence: "Target uploaded on 2024-03-15",
    SentenceTargetYear: "2040",
    Country: "Brazil",
    sector_code__1__NAICS_: "33333",
    sector_name__1__NAICS_: "Energy",
    upload_date: "2024-03-15",
  },
  {
    id: "18",
    Company: "Another Upload Date Test",
    DocURL: "https://uploaddatetest.com/report",
    Target_sentence: "Target uploaded in March 2024",
    SentenceTargetYear: "2046",
    Country: "Mexico",
    sector_code__1__NAICS_: "44444",
    sector_name__1__NAICS_: "Retail",
    upload_date: "2024-03-28",
  },
  // Combined Filters
  {
    id: "19",
    Company: "Acme Corp",
    DocURL: "https://acme.com/report-4",
    Target_sentence: "Reduce emissions by 60% by 2030 (USA)",
    SentenceTargetYear: "2030",
    Country: "USA",
    sector_code__1__NAICS_: "12345",
    sector_name__1__NAICS_: "Technology",
    upload_date: "2024-03-15", // Match with ID 17
  },
  {
    id: "20",
    Company: "Beta Industries",
    DocURL: "https://beta.com/report-3",
    Target_sentence: "Achieve net-zero emissions by 2040 (Canada)",
    SentenceTargetYear: "2040",
    Country: "Canada",
    sector_code__1__NAICS_: "67890",
    sector_name__1__NAICS_: "Manufacturing",
    upload_date: "2024-03-10", // Match with ID 2
  },
  // Edge Cases
  {
    id: "21",
    Company: "Null Values Test",
    DocURL: "https://nullvalues.com/report",
    Target_sentence: "Target with some null values",
    SentenceTargetYear: null,
    Country: null,
    sector_code__1__NAICS_: null,
    sector_name__1__NAICS_: null,
    upload_date: "2024-04-20",
  },
  {
    id: "22",
    Company: "Long String Test",
    DocURL: "https://longstring.com/report",
    Target_sentence:
      "This is an extremely long target sentence designed to test how the table handles very long strings in different columns. It should be truncated appropriately in the table cell and fully displayed in the modal when clicked.",
    SentenceTargetYear: "2050",
    Country: "Very Long Country Name",
    sector_code__1__NAICS_: "1234567890",
    sector_name__1__NAICS_: "Extremely Long Sector Name",
    upload_date: "2024-04-22",
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