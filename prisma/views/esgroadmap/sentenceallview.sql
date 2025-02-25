SELECT
  (`sa`.`Company` COLLATE utf8mb4_unicode_ci) AS `Company`,
(`sa`.`emails` COLLATE utf8mb4_unicode_ci) AS `emails`,
(`sa`.`full_text` COLLATE utf8mb4_unicode_ci) AS `full_text`,
(`sa`.`Source link` COLLATE utf8mb4_unicode_ci) AS `Source link`,
(`sa`.`pr_site` COLLATE utf8mb4_unicode_ci) AS `pr_site`,
(`sa`.`release_date` COLLATE utf8mb4_unicode_ci) AS `release_date`,
(`sa`.`source` COLLATE utf8mb4_unicode_ci) AS `source`,
(`sa`.`ticker` COLLATE utf8mb4_unicode_ci) AS `ticker`,
(`sa`.`title` COLLATE utf8mb4_unicode_ci) AS `title`,
(
    `sa`.`ArticleTargetYear` COLLATE utf8mb4_unicode_ci
  ) AS `ArticleTargetYear`,
(
    `sa`.`PressReleaseFullCleanstep1` COLLATE utf8mb4_unicode_ci
  ) AS `PressReleaseFullCleanstep1`,
(
    `sa`.`PressReleaseFullClean` COLLATE utf8mb4_unicode_ci
  ) AS `PressReleaseFullClean`,
(`sa`.`Source Date` COLLATE utf8mb4_unicode_ci) AS `Source Date`,
(
    `sa`.`Annual Report Date` COLLATE utf8mb4_unicode_ci
  ) AS `Annual Report Date`,
(
    `sa`.`PressReleaseYear` COLLATE utf8mb4_unicode_ci
  ) AS `PressReleaseYear`,
(
    `sa`.`PressReleaseMonth` COLLATE utf8mb4_unicode_ci
  ) AS `PressReleaseMonth`,
(
    `sa`.`Target sentence` COLLATE utf8mb4_unicode_ci
  ) AS `Target sentence`,
(
    `sa`.`SentenceTargetYear` COLLATE utf8mb4_unicode_ci
  ) AS `SentenceTargetYear`,
(`sa`.`Targetyear(s)` COLLATE utf8mb4_unicode_ci) AS `Targetyear(s)`,
(
    `sa`.`sentence-carbon` COLLATE utf8mb4_unicode_ci
  ) AS `sentence-carbon`,
(
    `sa`.`sentence-gender` COLLATE utf8mb4_unicode_ci
  ) AS `sentence-gender`,
(
    `sa`.`sentence-renewables` COLLATE utf8mb4_unicode_ci
  ) AS `sentence-renewables`,
(
    `sa`.`sentence-suppliers` COLLATE utf8mb4_unicode_ci
  ) AS `sentence-suppliers`,
(`sa`.`sentence-water` COLLATE utf8mb4_unicode_ci) AS `sentence-water`,
(`sa`.`sentence-waste` COLLATE utf8mb4_unicode_ci) AS `sentence-waste`,
(`sa`.`sentence-other` COLLATE utf8mb4_unicode_ci) AS `sentence-other`,
(`sa`.`upload-date` COLLATE utf8mb4_unicode_ci) AS `upload-date`,
(`sa`.`id` COLLATE utf8mb4_unicode_ci) AS `id`,
(`sa`.`PageURL` COLLATE utf8mb4_unicode_ci) AS `PageURL`,
(`sa`.`DocURL` COLLATE utf8mb4_unicode_ci) AS `DocURL`,
(`sa`.`DocTitle` COLLATE utf8mb4_unicode_ci) AS `DocTitle`,
(`sa`.`DocName` COLLATE utf8mb4_unicode_ci) AS `DocName`,
(
    `sa`.`Target Sentence Page` COLLATE utf8mb4_unicode_ci
  ) AS `Target Sentence Page`,
(
    `cd`.`Member of the S&P500` COLLATE utf8mb4_unicode_ci
  ) AS `Member of the S&P500`,
(
    `cd`.`Member of the Russell 1000 Index` COLLATE utf8mb4_unicode_ci
  ) AS `Member of the Russell 1000 Index`,
(`cd`.`Ticker(s)` COLLATE utf8mb4_unicode_ci) AS `Ticker(s)`,
(`cd`.`PR Agency` COLLATE utf8mb4_unicode_ci) AS `PR Agency`,
(
    `cd`.`Example 2020 company PR agency press release URL` COLLATE utf8mb4_unicode_ci
  ) AS `Example 2020 company PR agency press release URL`,
(
    `cd`.`Company global/main press - news release site URL` COLLATE utf8mb4_unicode_ci
  ) AS `Company global/main press - news release site URL`,
(
    `cd`.`Company annual reports page URL` COLLATE utf8mb4_unicode_ci
  ) AS `Company annual reports page URL`,
(
    `cd`.`Company sustainability / ESG reports page URL` COLLATE utf8mb4_unicode_ci
  ) AS `Company sustainability / ESG reports page URL`,
(`cd`.`Country` COLLATE utf8mb4_unicode_ci) AS `Country`,
(
    `cd`.`sector code #1 (NAICS)` COLLATE utf8mb4_unicode_ci
  ) AS `sector code #1 (NAICS)`,
(
    `cd`.`sector name #1 (NAICS)` COLLATE utf8mb4_unicode_ci
  ) AS `sector name #1 (NAICS)`,
(
    `cd`.`sector code #2 (NAICS)` COLLATE utf8mb4_unicode_ci
  ) AS `sector code #2 (NAICS)`,
(
    `cd`.`sector name #2 (NAICS)` COLLATE utf8mb4_unicode_ci
  ) AS `sector name #2 (NAICS)`,
(
    `cd`.`sector code #3 (NAICS)` COLLATE utf8mb4_unicode_ci
  ) AS `sector code #3 (NAICS)`,
(
    `cd`.`sector name #3 (NAICS)` COLLATE utf8mb4_unicode_ci
  ) AS `sector name #3 (NAICS)`,
(
    `cd`.`sector code #4 (NAICS)` COLLATE utf8mb4_unicode_ci
  ) AS `sector code #4 (NAICS)`,
(
    `cd`.`sector name #4 (NAICS)` COLLATE utf8mb4_unicode_ci
  ) AS `sector name #4 (NAICS)`,
(
    `cd`.`sector code #5 (NAICS)` COLLATE utf8mb4_unicode_ci
  ) AS `sector code #5 (NAICS)`,
(
    `cd`.`sector name #5 (NAICS)` COLLATE utf8mb4_unicode_ci
  ) AS `sector name #5 (NAICS)`
FROM
  (
    `esgroadmap`.`sentence-all` `sa`
    JOIN `esgroadmap`.`company_universe` `cd` ON(
      (
        (`sa`.`Company` COLLATE utf8mb4_unicode_ci) = `cd`.`Company`
      )
    )
  )