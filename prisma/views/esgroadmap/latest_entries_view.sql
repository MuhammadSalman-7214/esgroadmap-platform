SELECT
  `esgroadmap`.`sentence-all`.`release_date` AS `release_date`,
  `esgroadmap`.`sentence-all`.`Targetyear(s)` AS `Targetyear(s)`,
  `esgroadmap`.`sentence-all`.`pr_site` AS `pr_site`,
  `esgroadmap`.`sentence-all`.`ArticleTargetYear` AS `ArticleTargetYear`,
  `esgroadmap`.`sentence-all`.`sentence-carbon` AS `sentence-carbon`,
  `esgroadmap`.`sentence-all`.`full_text` AS `full_text`,
  `esgroadmap`.`sentence-all`.`PressReleaseMonth` AS `PressReleaseMonth`,
  `esgroadmap`.`sentence-all`.`PressReleaseFullClean` AS `PressReleaseFullClean`,
  `esgroadmap`.`sentence-all`.`sentence-renewables` AS `sentence-renewables`,
  `esgroadmap`.`sentence-all`.`sentence-suppliers` AS `sentence-suppliers`,
  `esgroadmap`.`sentence-all`.`sentence-gender` AS `sentence-gender`,
  `esgroadmap`.`sentence-all`.`Company` AS `Company`,
  `esgroadmap`.`sentence-all`.`Annual Report Date` AS `Annual Report Date`,
  `esgroadmap`.`sentence-all`.`title` AS `title`,
  `esgroadmap`.`sentence-all`.`emails` AS `emails`,
  `esgroadmap`.`sentence-all`.`sentence-other` AS `sentence-other`,
  `esgroadmap`.`sentence-all`.`Source link` AS `Source link`,
  `esgroadmap`.`sentence-all`.`Source Date` AS `Source Date`,
  `esgroadmap`.`sentence-all`.`PressReleaseFullCleanstep1` AS `PressReleaseFullCleanstep1`,
  `esgroadmap`.`sentence-all`.`sentence-waste` AS `sentence-waste`,
  `esgroadmap`.`sentence-all`.`source` AS `source`,
  `esgroadmap`.`sentence-all`.`sentence-water` AS `sentence-water`,
  `esgroadmap`.`sentence-all`.`PressReleaseYear` AS `PressReleaseYear`,
  `esgroadmap`.`sentence-all`.`ticker` AS `ticker`,
  `esgroadmap`.`sentence-all`.`SentenceTargetYear` AS `SentenceTargetYear`,
  `esgroadmap`.`sentence-all`.`Target sentence` AS `Target sentence`,
  `esgroadmap`.`sentence-all`.`upload-date` AS `upload-date`,
  `esgroadmap`.`sentence-all`.`id` AS `id`
FROM
  `esgroadmap`.`sentence-all`
WHERE
  (
    `esgroadmap`.`sentence-all`.`upload-date` >= (curdate() - INTERVAL 28 DAY)
  )