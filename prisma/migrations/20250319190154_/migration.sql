-- CreateTable
CREATE TABLE `Unique_Factors_Table` (
    `KPI Report Date` DATE NOT NULL,
    `Company (NON-NULL Total)` VARCHAR(10) NULL,
    `Company (NON-NULL Unique)` VARCHAR(10) NULL,
    `Member of the S&P500 (YES Total)` VARCHAR(10) NULL,
    `Member of the Russell 1000 Index (YES Total)` VARCHAR(10) NULL,
    `Ticker(s) (NON-NULL Total)` VARCHAR(10) NULL,
    `Ticker(s) (NON-NULL Unique)` VARCHAR(10) NULL,
    `Country (NON-NULL Total)` VARCHAR(10) NULL,
    `Country (NON-NULL Unique)` VARCHAR(10) NULL,
    `sector code #1 (NAICS) (NON-NULL Unique)` VARCHAR(10) NULL,
    `sector code #2 (NAICS) (NON-NULL Unique)` VARCHAR(10) NULL,
    `sector code #3 (NAICS) (NON-NULL Unique)` VARCHAR(10) NULL,
    `sector code #4 (NAICS) (NON-NULL Unique)` VARCHAR(10) NULL,
    `sector code #5 (NAICS) (NON-NULL Unique)` VARCHAR(10) NULL,
    `sector codes all (NAICS) (NON-NULL Unique)` VARCHAR(10) NULL,
    `ArticleTargetYear (NON-NULL Unique)` VARCHAR(10) NULL,
    `Source Date (NON-NULL Unique)` VARCHAR(10) NULL,
    `PressReleaseYear (NON-NULL Unique)` VARCHAR(10) NULL,
    `Target sentence (NON-NULL Total)` VARCHAR(10) NULL,
    `Target sentence (NON-NULL Unique)` VARCHAR(10) NULL,
    `Targetyear(s) (NON-NULL Unique)` VARCHAR(10) NULL,
    `sentence-carbon (1 Total)` VARCHAR(10) NULL,
    `sentence-gender (1 Total)` VARCHAR(10) NULL,
    `sentence-renewables (1 Total)` VARCHAR(10) NULL,
    `sentence-suppliers (1 Total)` VARCHAR(10) NULL,
    `sentence-water (1 Total)` VARCHAR(10) NULL,
    `sentence-waste (1 Total)` VARCHAR(10) NULL,
    `sentence-other (1 Total)` VARCHAR(10) NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_universe` (
    `Company` VARCHAR(255) NOT NULL,
    `x` VARCHAR(255) NULL,
    `Member of the S&P500` VARCHAR(255) NULL,
    `Member of the Russell 1000 Index` VARCHAR(255) NULL,
    `source` VARCHAR(255) NULL,
    `Scraping code set up ?` VARCHAR(255) NULL,
    `Ticker(s)` VARCHAR(255) NULL,
    `PR Agency` VARCHAR(255) NULL,
    `Example 2020 company PR agency press release URL` TEXT NULL,
    `Domain` VARCHAR(500) NULL,
    `Company global/main press - news release site URL` TEXT NULL,
    `Subscribed to press releases esgroadmap@gmail.com ?` VARCHAR(255) NULL,
    `Subscribed to press releases jameskijani@gmail.com ?` VARCHAR(255) NULL,
    `Plain text press release subscription possible? (yes/no)` VARCHAR(3) NULL,
    `Company annual reports page URL` TEXT NULL,
    `Company annual report 2020 URL of pdf document (including 10-k)` TEXT NULL,
    `Company sustainability / ESG reports page URL` TEXT NULL,
    `Company Sustainability / ESG report 2020 URL of pdf document` TEXT NULL,
    `Country` VARCHAR(255) NULL,
    `sector code #1 (NAICS)` VARCHAR(10) NULL,
    `sector name #1 (NAICS)` VARCHAR(255) NULL,
    `sector code #2 (NAICS)` VARCHAR(10) NULL,
    `sector name #2 (NAICS)` VARCHAR(255) NULL,
    `sector code #3 (NAICS)` VARCHAR(10) NULL,
    `sector name #3 (NAICS)` VARCHAR(255) NULL,
    `sector code #4 (NAICS)` VARCHAR(10) NULL,
    `sector name #4 (NAICS)` VARCHAR(255) NULL,
    `sector code #5 (NAICS)` VARCHAR(10) NULL,
    `sector name #5 (NAICS)` VARCHAR(255) NULL,
    `WORKED BY:` VARCHAR(255) NULL,
    `COMMENTS / NOTES` TEXT NULL,
    `Carbon sentence available ?` VARCHAR(255) NULL,

    PRIMARY KEY (`Company`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `companydata` (
    `company` TEXT NULL,
    `Member of the S&P500` TEXT NULL,
    `Member of the Russell 1000 Index` TEXT NULL,
    `Ticker(s)` TEXT NULL,
    `PR Agency` TEXT NULL,
    `Example 2020 company PR agency press release URL` TEXT NULL,
    `Company Global / Main Website URL` TEXT NULL,
    `Company global/main press - news release site URL` TEXT NULL,
    `Company annual reports page URL` TEXT NULL,
    `Company annual / financial report 2020 URL of pdf document` TEXT NULL,
    `Company sustainability / ESG reports page URL` TEXT NULL,
    `Company Sustainability / ESG report 2020 URL of pdf document` TEXT NULL,
    `Country` TEXT NULL,
    `sector code #1 (NAICS)` BIGINT NULL,
    `sector name #1 (NAICS)` TEXT NULL,
    `sector code #2 (NAICS)` TEXT NULL,
    `sector name #2 (NAICS)` TEXT NULL,
    `sector code #3 (NAICS)` TEXT NULL,
    `sector name #3 (NAICS)` TEXT NULL,
    `sector code #4 (NAICS)` TEXT NULL,
    `sector name #4 (NAICS)` TEXT NULL,
    `sector code #5 (NAICS)` TEXT NULL,
    `sector name #5 (NAICS)` TEXT NULL,
    `sector codes all (NAICS)` TEXT NULL,
    `sector name all (NAICS)` TEXT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `companydata2` (
    `company` TEXT NULL,
    `Member of the S&P500` TEXT NULL,
    `Member of the Russell 1000 Index` TEXT NULL,
    `Ticker(s)` TEXT NULL,
    `PR Agency` TEXT NULL,
    `Example 2020 company PR agency press release URL` TEXT NULL,
    `Company Global / Main Website URL` TEXT NULL,
    `Company global/main press - news release site URL` TEXT NULL,
    `Company annual reports page URL` TEXT NULL,
    `Company annual / financial report 2020 URL of pdf document` TEXT NULL,
    `Company sustainability / ESG reports page URL` TEXT NULL,
    `Company Sustainability / ESG report 2020 URL of pdf document` TEXT NULL,
    `Country` TEXT NULL,
    `sector code #1 (NAICS)` TEXT NULL,
    `sector name #1 (NAICS)` TEXT NULL,
    `sector code #2 (NAICS)` TEXT NULL,
    `sector name #2 (NAICS)` TEXT NULL,
    `sector code #3 (NAICS)` TEXT NULL,
    `sector name #3 (NAICS)` TEXT NULL,
    `sector code #4 (NAICS)` TEXT NULL,
    `sector name #4 (NAICS)` TEXT NULL,
    `sector code #5 (NAICS)` TEXT NULL,
    `sector name #5 (NAICS)` TEXT NULL,
    `sector codes all (NAICS)` TEXT NULL,
    `sector name all (NAICS)` TEXT NULL,
    `NAICS #1 GIG` TEXT NULL,
    `NAICS #1 GIG name` TEXT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `percentage_table` (
    `KPI Report Date` DATE NOT NULL,
    `Company` VARCHAR(10) NULL,
    `Member of the S&P500` VARCHAR(10) NULL,
    `Member of the Russell 1000 Index` VARCHAR(10) NULL,
    `Ticker(s)` VARCHAR(10) NULL,
    `PR Agency` VARCHAR(10) NULL,
    `Example 2020 company PR agency press release URL` VARCHAR(10) NULL,
    `Company Global / Main Website URL` VARCHAR(10) NULL,
    `Company global/main press - news release site URL` VARCHAR(10) NULL,
    `Company annual reports page URL` VARCHAR(10) NULL,
    `Company annual / financial report 2020 URL of pdf document` VARCHAR(10) NULL,
    `Company sustainability / ESG reports page URL` VARCHAR(10) NULL,
    `Company Sustainability / ESG report 2020 URL of pdf document` VARCHAR(10) NULL,
    `Country` VARCHAR(10) NULL,
    `sector code #1 (NAICS)` VARCHAR(10) NULL,
    `sector name #1 (NAICS)` VARCHAR(10) NULL,
    `sector code #2 (NAICS)` VARCHAR(10) NULL,
    `sector name #2 (NAICS)` VARCHAR(10) NULL,
    `sector code #3 (NAICS)` VARCHAR(10) NULL,
    `sector name #3 (NAICS)` VARCHAR(10) NULL,
    `sector code #4 (NAICS)` VARCHAR(10) NULL,
    `sector name #4 (NAICS)` VARCHAR(10) NULL,
    `sector code #5 (NAICS)` VARCHAR(10) NULL,
    `sector name #5 (NAICS)` VARCHAR(10) NULL,
    `sector codes all (NAICS)` VARCHAR(10) NULL,
    `sector name all (NAICS)` VARCHAR(10) NULL,
    `climateaction100` VARCHAR(10) NULL,
    `emails` VARCHAR(10) NULL,
    `full_text` VARCHAR(10) NULL,
    `Source link` VARCHAR(10) NULL,
    `pr_site` VARCHAR(10) NULL,
    `release_date` VARCHAR(10) NULL,
    `source` VARCHAR(10) NULL,
    `ticker` VARCHAR(10) NULL,
    `title` VARCHAR(10) NULL,
    `ArticleTargetYear` VARCHAR(10) NULL,
    `PressReleaseFullCleanstep1` VARCHAR(10) NULL,
    `PressReleaseFullClean` VARCHAR(10) NULL,
    `Source Date` VARCHAR(10) NULL,
    `Annual Report Date` VARCHAR(10) NULL,
    `PressReleaseYear` VARCHAR(10) NULL,
    `PressReleaseMonth` VARCHAR(10) NULL,
    `Target sentence` VARCHAR(10) NULL,
    `SentenceTargetYear` VARCHAR(10) NULL,
    `Targetyear(s)` VARCHAR(10) NULL,
    `sentence-carbon` VARCHAR(10) NULL,
    `sentence-gender` VARCHAR(10) NULL,
    `sentence-renewables` VARCHAR(10) NULL,
    `sentence-suppliers` VARCHAR(10) NULL,
    `sentence-water` VARCHAR(10) NULL,
    `sentence-waste` VARCHAR(10) NULL,
    `sentence-other` VARCHAR(10) NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roadmap-carbon` (
    `Company` TEXT NULL,
    `Ticker(s)` TEXT NULL,
    `PR Agency` TEXT NULL,
    `Company Main Website URL` TEXT NULL,
    `Company Source site URL` TEXT NULL,
    `Country` TEXT NULL,
    `sector code #1 (NAICS)` BIGINT NULL,
    `sector name #1 (NAICS)` TEXT NULL,
    `sector code #2 (NAICS)` TEXT NULL,
    `sector name #2 (NAICS)` TEXT NULL,
    `sector code #3 (NAICS)` TEXT NULL,
    `sector name #3 (NAICS)` TEXT NULL,
    `sector code #4 (NAICS)` TEXT NULL,
    `sector name #4 (NAICS)` TEXT NULL,
    `sector code #5 (NAICS)` TEXT NULL,
    `sector name #5 (NAICS)` TEXT NULL,
    `S&P500member` TEXT NULL,
    `Russell 1000 member` TEXT NULL,
    `Source link 1` TEXT NULL,
    `Source date 1` TEXT NULL,
    `Source sentence 1` TEXT NULL,
    `Targetyear(s) 1` TEXT NULL,
    `Source link 2` TEXT NULL,
    `Source date 2` TEXT NULL,
    `Source sentence 2` TEXT NULL,
    `Targetyear(s) 2` TEXT NULL,
    `Source link 3` TEXT NULL,
    `Source date 3` TEXT NULL,
    `Source sentence 3` TEXT NULL,
    `Targetyear(s) 3` TEXT NULL,
    `Source link 4` TEXT NULL,
    `Source date 4` TEXT NULL,
    `Source sentence 4` TEXT NULL,
    `Targetyear(s) 4` DOUBLE NULL,
    `Source link 5` TEXT NULL,
    `Source date 5` TEXT NULL,
    `Source sentence 5` TEXT NULL,
    `Targetyear(s) 5` DOUBLE NULL,
    `Source link 6` TEXT NULL,
    `Source date 6` TEXT NULL,
    `Source sentence 6` TEXT NULL,
    `Targetyear(s) 6` DOUBLE NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sentence-all` (
    `release_date` TEXT NULL,
    `Targetyear(s)` TEXT NULL,
    `pr_site` TEXT NULL,
    `ArticleTargetYear` TEXT NULL,
    `sentence-carbon` BIGINT NULL,
    `full_text` TEXT NULL,
    `PressReleaseMonth` TEXT NULL,
    `PressReleaseFullClean` TEXT NULL,
    `sentence-renewables` BIGINT NULL,
    `sentence-suppliers` BIGINT NULL,
    `sentence-gender` BIGINT NULL,
    `Company` TEXT NULL,
    `Annual Report Date` TEXT NULL,
    `title` TEXT NULL,
    `emails` TEXT NULL,
    `sentence-other` BIGINT NULL,
    `Source link` TEXT NULL,
    `Source Date` TEXT NULL,
    `PressReleaseFullCleanstep1` TEXT NULL,
    `sentence-waste` BIGINT NULL,
    `source` TEXT NULL,
    `sentence-water` BIGINT NULL,
    `PressReleaseYear` TEXT NULL,
    `ticker` TEXT NULL,
    `SentenceTargetYear` TEXT NULL,
    `Target sentence` TEXT NULL,
    `upload-date` TEXT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `PageURL` VARCHAR(255) NULL,
    `DocURL` VARCHAR(255) NULL,
    `DocTitle` VARCHAR(255) NULL,
    `DocName` VARCHAR(255) NULL,
    `Target Sentence Page` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `targetsentences` (
    `Company` TEXT NULL,
    `companylist` TEXT NULL,
    `Ticker(s)` TEXT NULL,
    `PR Agency` TEXT NULL,
    `Example 2020 company PR agency press release URL` TEXT NULL,
    `Company Main Website URL` TEXT NULL,
    `Company press release site URL` TEXT NULL,
    `Country` TEXT NULL,
    `sector code #1 (NAICS)` BIGINT NULL,
    `sector name #1 (NAICS)` TEXT NULL,
    `sector code #2 (NAICS)` TEXT NULL,
    `sector name #2 (NAICS)` TEXT NULL,
    `sector code #3 (NAICS)` TEXT NULL,
    `sector name #3 (NAICS)` TEXT NULL,
    `sector code #4 (NAICS)` TEXT NULL,
    `sector name #4 (NAICS)` TEXT NULL,
    `sector code #5 (NAICS)` TEXT NULL,
    `sector name #5 (NAICS)` TEXT NULL,
    `S&P500member` TEXT NULL,
    `Russell 1000 member` TEXT NULL,
    `emails` TEXT NULL,
    `full_text` TEXT NULL,
    `Source link` TEXT NULL,
    `pr_site` TEXT NULL,
    `release_date` TEXT NULL,
    `source` TEXT NULL,
    `ticker` TEXT NULL,
    `title` TEXT NULL,
    `ArticleTargetYear` TEXT NULL,
    `PressReleaseFullCleanstep1` TEXT NULL,
    `PressReleaseFullClean` TEXT NULL,
    `Source date` TEXT NULL,
    `PressReleaseYear` BIGINT NULL,
    `PressReleaseMonth` BIGINT NULL,
    `Target sentence` TEXT NULL,
    `SentenceTargetYear` TEXT NULL,
    `Targetyear(s)` TEXT NULL,
    `sentence-carbon` BOOLEAN NULL,
    `sentence-gender` BOOLEAN NULL,
    `sentence-renewables` BOOLEAN NULL,
    `sentence-suppliers` BOOLEAN NULL,
    `sentence-water` BOOLEAN NULL,
    `Primarysource` BOOLEAN NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `testtable` (
    `firstname` INTEGER NOT NULL,
    `surname` INTEGER NOT NULL,
    `city` INTEGER NOT NULL,
    `country` INTEGER NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_actionscheduler_actions` (
    `action_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `hook` VARCHAR(191) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `scheduled_date_gmt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `scheduled_date_local` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `args` VARCHAR(191) NULL,
    `schedule` LONGTEXT NULL,
    `group_id` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `last_attempt_gmt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `last_attempt_local` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `claim_id` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `extended_args` VARCHAR(8000) NULL,

    INDEX `args`(`args`),
    INDEX `claim_id`(`claim_id`),
    INDEX `group_id`(`group_id`),
    INDEX `hook`(`hook`),
    INDEX `last_attempt_gmt`(`last_attempt_gmt`),
    INDEX `scheduled_date_gmt`(`scheduled_date_gmt`),
    INDEX `status`(`status`),
    PRIMARY KEY (`action_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_actionscheduler_claims` (
    `claim_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `date_created_gmt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `date_created_gmt`(`date_created_gmt`),
    PRIMARY KEY (`claim_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_actionscheduler_groups` (
    `group_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(255) NOT NULL,

    INDEX `slug`(`slug`(191)),
    PRIMARY KEY (`group_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_actionscheduler_logs` (
    `log_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `action_id` BIGINT UNSIGNED NOT NULL,
    `message` TEXT NOT NULL,
    `log_date_gmt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `log_date_local` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `action_id`(`action_id`),
    INDEX `log_date_gmt`(`log_date_gmt`),
    PRIMARY KEY (`log_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_aioseo_notifications` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(13) NOT NULL,
    `title` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `type` VARCHAR(64) NOT NULL,
    `level` TEXT NOT NULL,
    `notification_id` BIGINT UNSIGNED NULL,
    `notification_name` VARCHAR(255) NULL,
    `start` DATETIME(0) NULL,
    `end` DATETIME(0) NULL,
    `button1_label` VARCHAR(255) NULL,
    `button1_action` VARCHAR(255) NULL,
    `button2_label` VARCHAR(255) NULL,
    `button2_action` VARCHAR(255) NULL,
    `dismissed` BOOLEAN NOT NULL DEFAULT false,
    `created` DATETIME(0) NOT NULL,
    `updated` DATETIME(0) NOT NULL,

    UNIQUE INDEX `ndx_aioseo_notifications_slug`(`slug`),
    INDEX `ndx_aioseo_notifications_dates`(`start`, `end`),
    INDEX `ndx_aioseo_notifications_dismissed`(`dismissed`),
    INDEX `ndx_aioseo_notifications_type`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_aioseo_posts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `post_id` BIGINT UNSIGNED NOT NULL,
    `title` TEXT NULL,
    `description` TEXT NULL,
    `keywords` MEDIUMTEXT NULL,
    `keyphrases` LONGTEXT NULL,
    `page_analysis` LONGTEXT NULL,
    `canonical_url` TEXT NULL,
    `og_title` TEXT NULL,
    `og_description` TEXT NULL,
    `og_object_type` VARCHAR(64) NULL DEFAULT 'default',
    `og_image_type` VARCHAR(64) NULL DEFAULT 'default',
    `og_image_custom_url` TEXT NULL,
    `og_image_custom_fields` TEXT NULL,
    `og_custom_image_width` INTEGER NULL,
    `og_custom_image_height` INTEGER NULL,
    `og_video` VARCHAR(255) NULL,
    `og_custom_url` TEXT NULL,
    `og_article_section` TEXT NULL,
    `og_article_tags` TEXT NULL,
    `twitter_use_og` BOOLEAN NULL DEFAULT false,
    `twitter_card` VARCHAR(64) NULL DEFAULT 'default',
    `twitter_image_type` VARCHAR(64) NULL DEFAULT 'default',
    `twitter_image_custom_url` TEXT NULL,
    `twitter_image_custom_fields` TEXT NULL,
    `twitter_title` TEXT NULL,
    `twitter_description` TEXT NULL,
    `seo_score` INTEGER NOT NULL DEFAULT 0,
    `schema_type` VARCHAR(20) NULL,
    `schema_type_options` LONGTEXT NULL,
    `pillar_content` BOOLEAN NULL,
    `robots_default` BOOLEAN NOT NULL DEFAULT true,
    `robots_noindex` BOOLEAN NOT NULL DEFAULT false,
    `robots_noarchive` BOOLEAN NOT NULL DEFAULT false,
    `robots_nosnippet` BOOLEAN NOT NULL DEFAULT false,
    `robots_nofollow` BOOLEAN NOT NULL DEFAULT false,
    `robots_noimageindex` BOOLEAN NOT NULL DEFAULT false,
    `robots_noodp` BOOLEAN NOT NULL DEFAULT false,
    `robots_notranslate` BOOLEAN NOT NULL DEFAULT false,
    `robots_max_snippet` INTEGER NULL,
    `robots_max_videopreview` INTEGER NULL,
    `robots_max_imagepreview` VARCHAR(20) NULL DEFAULT 'large',
    `tabs` MEDIUMTEXT NULL,
    `images` LONGTEXT NULL,
    `image_scan_date` DATETIME(0) NULL,
    `priority` TINYTEXT NULL,
    `frequency` TINYTEXT NULL,
    `videos` LONGTEXT NULL,
    `video_thumbnail` TEXT NULL,
    `video_scan_date` DATETIME(0) NULL,
    `local_seo` LONGTEXT NULL,
    `created` DATETIME(0) NOT NULL,
    `updated` DATETIME(0) NOT NULL,

    INDEX `ndx_aioseo_posts_post_id`(`post_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_commentmeta` (
    `meta_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `comment_id` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `meta_key` VARCHAR(255) NULL,
    `meta_value` LONGTEXT NULL,

    INDEX `comment_id`(`comment_id`),
    INDEX `meta_key`(`meta_key`(191)),
    PRIMARY KEY (`meta_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_comments` (
    `comment_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `comment_post_ID` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `comment_author` TINYTEXT NOT NULL,
    `comment_author_email` VARCHAR(100) NOT NULL DEFAULT '',
    `comment_author_url` VARCHAR(200) NOT NULL DEFAULT '',
    `comment_author_IP` VARCHAR(100) NOT NULL DEFAULT '',
    `comment_date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `comment_date_gmt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `comment_content` TEXT NOT NULL,
    `comment_karma` INTEGER NOT NULL DEFAULT 0,
    `comment_approved` VARCHAR(20) NOT NULL DEFAULT '1',
    `comment_agent` VARCHAR(255) NOT NULL DEFAULT '',
    `comment_type` VARCHAR(20) NOT NULL DEFAULT 'comment',
    `comment_parent` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `user_id` BIGINT UNSIGNED NOT NULL DEFAULT 0,

    INDEX `comment_approved_date_gmt`(`comment_approved`, `comment_date_gmt`),
    INDEX `comment_author_email`(`comment_author_email`(10)),
    INDEX `comment_date_gmt`(`comment_date_gmt`),
    INDEX `comment_parent`(`comment_parent`),
    INDEX `comment_post_ID`(`comment_post_ID`),
    PRIMARY KEY (`comment_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_links` (
    `link_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `link_url` VARCHAR(255) NOT NULL DEFAULT '',
    `link_name` VARCHAR(255) NOT NULL DEFAULT '',
    `link_image` VARCHAR(255) NOT NULL DEFAULT '',
    `link_target` VARCHAR(25) NOT NULL DEFAULT '',
    `link_description` VARCHAR(255) NOT NULL DEFAULT '',
    `link_visible` VARCHAR(20) NOT NULL DEFAULT 'Y',
    `link_owner` BIGINT UNSIGNED NOT NULL DEFAULT 1,
    `link_rating` INTEGER NOT NULL DEFAULT 0,
    `link_updated` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `link_rel` VARCHAR(255) NOT NULL DEFAULT '',
    `link_notes` MEDIUMTEXT NOT NULL,
    `link_rss` VARCHAR(255) NOT NULL DEFAULT '',

    INDEX `link_visible`(`link_visible`),
    PRIMARY KEY (`link_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_nextend2_image_storage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hash` VARCHAR(32) NOT NULL,
    `image` TEXT NOT NULL,
    `value` MEDIUMTEXT NOT NULL,

    UNIQUE INDEX `hash`(`hash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_nextend2_section_storage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `application` VARCHAR(20) NOT NULL,
    `section` VARCHAR(128) NOT NULL,
    `referencekey` VARCHAR(128) NOT NULL,
    `value` MEDIUMTEXT NOT NULL,
    `system` INTEGER NOT NULL DEFAULT 0,
    `editable` INTEGER NOT NULL DEFAULT 1,

    INDEX `application`(`application`, `section`(50), `referencekey`(50)),
    INDEX `application_2`(`application`, `section`(50)),
    INDEX `editable`(`editable`),
    INDEX `system`(`system`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_nextend2_smartslider3_generators` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `group` VARCHAR(254) NOT NULL,
    `type` VARCHAR(254) NOT NULL,
    `params` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_nextend2_smartslider3_sliders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `alias` VARCHAR(255) NULL,
    `title` VARCHAR(200) NOT NULL,
    `type` VARCHAR(30) NOT NULL,
    `params` MEDIUMTEXT NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'published',
    `time` DATETIME(0) NOT NULL,
    `thumbnail` VARCHAR(255) NOT NULL,
    `ordering` INTEGER NOT NULL DEFAULT 0,

    INDEX `status`(`status`),
    INDEX `time`(`time`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_nextend2_smartslider3_sliders_xref` (
    `group_id` INTEGER NOT NULL,
    `slider_id` INTEGER NOT NULL,
    `ordering` INTEGER NOT NULL DEFAULT 0,

    INDEX `ordering`(`ordering`),
    PRIMARY KEY (`group_id`, `slider_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_nextend2_smartslider3_slides` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `slider` INTEGER NOT NULL,
    `publish_up` DATETIME(0) NOT NULL DEFAULT '1970-01-01 00:00:00',
    `publish_down` DATETIME(0) NOT NULL DEFAULT '1970-01-01 00:00:00',
    `published` BOOLEAN NOT NULL,
    `first` INTEGER NOT NULL,
    `slide` LONGTEXT NULL,
    `description` TEXT NOT NULL,
    `thumbnail` VARCHAR(255) NOT NULL,
    `params` TEXT NOT NULL,
    `ordering` INTEGER NOT NULL,
    `generator_id` INTEGER NOT NULL,

    INDEX `generator_id`(`generator_id`),
    INDEX `ordering`(`ordering`),
    INDEX `publish_down`(`publish_down`),
    INDEX `publish_up`(`publish_up`),
    INDEX `published`(`published`),
    INDEX `slider`(`slider`),
    INDEX `thumbnail`(`thumbnail`(100)),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_options` (
    `option_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `option_name` VARCHAR(191) NOT NULL DEFAULT '',
    `option_value` LONGTEXT NOT NULL,
    `autoload` VARCHAR(20) NOT NULL DEFAULT 'yes',

    UNIQUE INDEX `option_name`(`option_name`),
    INDEX `autoload`(`autoload`),
    PRIMARY KEY (`option_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_postmeta` (
    `meta_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `post_id` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `meta_key` VARCHAR(255) NULL,
    `meta_value` LONGTEXT NULL,

    INDEX `meta_key`(`meta_key`(191)),
    INDEX `post_id`(`post_id`),
    PRIMARY KEY (`meta_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_posts` (
    `ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `post_author` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `post_date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `post_date_gmt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `post_content` LONGTEXT NOT NULL,
    `post_title` TEXT NOT NULL,
    `post_excerpt` TEXT NOT NULL,
    `post_status` VARCHAR(20) NOT NULL DEFAULT 'publish',
    `comment_status` VARCHAR(20) NOT NULL DEFAULT 'open',
    `ping_status` VARCHAR(20) NOT NULL DEFAULT 'open',
    `post_password` VARCHAR(255) NOT NULL DEFAULT '',
    `post_name` VARCHAR(200) NOT NULL DEFAULT '',
    `to_ping` TEXT NOT NULL,
    `pinged` TEXT NOT NULL,
    `post_modified` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `post_modified_gmt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `post_content_filtered` LONGTEXT NOT NULL,
    `post_parent` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `guid` VARCHAR(255) NOT NULL DEFAULT '',
    `menu_order` INTEGER NOT NULL DEFAULT 0,
    `post_type` VARCHAR(20) NOT NULL DEFAULT 'post',
    `post_mime_type` VARCHAR(100) NOT NULL DEFAULT '',
    `comment_count` BIGINT NOT NULL DEFAULT 0,

    INDEX `post_author`(`post_author`),
    INDEX `post_name`(`post_name`(191)),
    INDEX `post_parent`(`post_parent`),
    INDEX `type_status_date`(`post_type`, `post_status`, `post_date`, `ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_term_relationships` (
    `object_id` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `term_taxonomy_id` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `term_order` INTEGER NOT NULL DEFAULT 0,

    INDEX `term_taxonomy_id`(`term_taxonomy_id`),
    PRIMARY KEY (`object_id`, `term_taxonomy_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_term_taxonomy` (
    `term_taxonomy_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `term_id` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `taxonomy` VARCHAR(32) NOT NULL DEFAULT '',
    `description` LONGTEXT NOT NULL,
    `parent` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `count` BIGINT NOT NULL DEFAULT 0,

    INDEX `taxonomy`(`taxonomy`),
    UNIQUE INDEX `term_id_taxonomy`(`term_id`, `taxonomy`),
    PRIMARY KEY (`term_taxonomy_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_termmeta` (
    `meta_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `term_id` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `meta_key` VARCHAR(255) NULL,
    `meta_value` LONGTEXT NULL,

    INDEX `meta_key`(`meta_key`(191)),
    INDEX `term_id`(`term_id`),
    PRIMARY KEY (`meta_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_terms` (
    `term_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL DEFAULT '',
    `slug` VARCHAR(200) NOT NULL DEFAULT '',
    `term_group` BIGINT NOT NULL DEFAULT 0,

    INDEX `name`(`name`(191)),
    INDEX `slug`(`slug`(191)),
    PRIMARY KEY (`term_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_um_metadata` (
    `umeta_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `um_key` VARCHAR(255) NULL,
    `um_value` LONGTEXT NULL,

    INDEX `meta_key_indx`(`um_key`),
    INDEX `meta_value_indx`(`um_value`(191)),
    INDEX `user_id_indx`(`user_id`),
    PRIMARY KEY (`umeta_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_user_registration_sessions` (
    `session_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `session_key` CHAR(32) NOT NULL,
    `session_value` LONGTEXT NOT NULL,
    `session_expiry` BIGINT UNSIGNED NOT NULL,

    UNIQUE INDEX `session_id`(`session_id`),
    PRIMARY KEY (`session_key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_usermeta` (
    `umeta_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `meta_key` VARCHAR(255) NULL,
    `meta_value` LONGTEXT NULL,

    INDEX `meta_key`(`meta_key`(191)),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`umeta_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_users` (
    `ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_login` VARCHAR(60) NOT NULL DEFAULT '',
    `user_pass` VARCHAR(255) NOT NULL DEFAULT '',
    `user_nicename` VARCHAR(50) NOT NULL DEFAULT '',
    `user_email` VARCHAR(100) NOT NULL DEFAULT '',
    `user_url` VARCHAR(100) NOT NULL DEFAULT '',
    `user_registered` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `user_activation_key` VARCHAR(255) NOT NULL DEFAULT '',
    `user_status` INTEGER NOT NULL DEFAULT 0,
    `display_name` VARCHAR(250) NOT NULL DEFAULT '',

    INDEX `user_email`(`user_email`),
    INDEX `user_login_key`(`user_login`),
    INDEX `user_nicename`(`user_nicename`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_wpdatacharts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `wpdatatable_id` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `engine` ENUM('google', 'highcharts', 'chartjs') NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `json_render_data` TEXT NOT NULL,

    UNIQUE INDEX `id`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_wpdatatables` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `show_title` BOOLEAN NOT NULL DEFAULT true,
    `table_type` VARCHAR(55) NOT NULL,
    `content` TEXT NOT NULL,
    `filtering` BOOLEAN NOT NULL DEFAULT true,
    `filtering_form` BOOLEAN NOT NULL DEFAULT false,
    `sorting` BOOLEAN NOT NULL DEFAULT true,
    `tools` BOOLEAN NOT NULL DEFAULT true,
    `server_side` BOOLEAN NOT NULL DEFAULT false,
    `editable` BOOLEAN NOT NULL DEFAULT false,
    `inline_editing` BOOLEAN NOT NULL DEFAULT false,
    `popover_tools` BOOLEAN NOT NULL DEFAULT false,
    `editor_roles` VARCHAR(255) NOT NULL DEFAULT '',
    `mysql_table_name` VARCHAR(255) NOT NULL DEFAULT '',
    `edit_only_own_rows` BOOLEAN NOT NULL DEFAULT false,
    `userid_column_id` INTEGER NOT NULL DEFAULT 0,
    `display_length` INTEGER NOT NULL DEFAULT 10,
    `auto_refresh` INTEGER NOT NULL DEFAULT 0,
    `fixed_columns` TINYINT NOT NULL DEFAULT -1,
    `fixed_layout` BOOLEAN NOT NULL DEFAULT false,
    `responsive` BOOLEAN NOT NULL DEFAULT false,
    `scrollable` BOOLEAN NOT NULL DEFAULT false,
    `word_wrap` BOOLEAN NOT NULL DEFAULT false,
    `hide_before_load` BOOLEAN NOT NULL DEFAULT false,
    `var1` VARCHAR(255) NOT NULL DEFAULT '',
    `var2` VARCHAR(255) NOT NULL DEFAULT '',
    `var3` VARCHAR(255) NOT NULL DEFAULT '',
    `tabletools_config` VARCHAR(255) NOT NULL DEFAULT '',
    `advanced_settings` TEXT NOT NULL,
    `connection` VARCHAR(55) NOT NULL DEFAULT '',

    UNIQUE INDEX `id`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_wpdatatables_columns` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `table_id` INTEGER NOT NULL,
    `orig_header` VARCHAR(255) NOT NULL,
    `display_header` VARCHAR(255) NOT NULL,
    `filter_type` ENUM('none', 'null_str', 'text', 'number', 'number-range', 'date-range', 'datetime-range', 'time-range', 'select', 'multiselect', 'checkbox') NOT NULL,
    `column_type` ENUM('autodetect', 'string', 'int', 'float', 'date', 'link', 'email', 'image', 'formula', 'datetime', 'time', 'masterdetail') NOT NULL,
    `input_type` ENUM('none', 'text', 'textarea', 'mce-editor', 'date', 'datetime', 'time', 'link', 'email', 'selectbox', 'multi-selectbox', 'attachment') NOT NULL DEFAULT 'text',
    `input_mandatory` BOOLEAN NOT NULL DEFAULT false,
    `id_column` BOOLEAN NOT NULL DEFAULT false,
    `group_column` BOOLEAN NOT NULL DEFAULT false,
    `sort_column` BOOLEAN NOT NULL DEFAULT false,
    `hide_on_phones` BOOLEAN NOT NULL DEFAULT false,
    `hide_on_tablets` BOOLEAN NOT NULL DEFAULT false,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `sum_column` BOOLEAN NOT NULL DEFAULT false,
    `skip_thousands_separator` BOOLEAN NOT NULL DEFAULT false,
    `width` VARCHAR(4) NOT NULL DEFAULT '',
    `possible_values` TEXT NOT NULL,
    `default_value` VARCHAR(100) NOT NULL DEFAULT '',
    `css_class` VARCHAR(255) NOT NULL DEFAULT '',
    `text_before` VARCHAR(255) NOT NULL DEFAULT '',
    `text_after` VARCHAR(255) NOT NULL DEFAULT '',
    `formatting_rules` TEXT NOT NULL,
    `calc_formula` TEXT NOT NULL,
    `color` VARCHAR(255) NOT NULL DEFAULT '',
    `advanced_settings` TEXT NOT NULL,
    `pos` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `id`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_wpdatatables_rows` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `table_id` INTEGER NOT NULL,
    `data` TEXT NOT NULL,

    UNIQUE INDEX `id`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_wpforms_tasks_meta` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `action` VARCHAR(255) NOT NULL,
    `data` LONGTEXT NOT NULL,
    `date` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `profile_image` TEXT NULL,
    `plan` INTEGER NOT NULL DEFAULT 1,
    `role` VARCHAR(255) NOT NULL DEFAULT 'user',
    `stripeId` VARCHAR(255) NULL DEFAULT 'stripe_id',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `id`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tickets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `id`(`id`),
    INDEX `tickets_userId_fkey`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket_documents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,
    `ticketId` INTEGER NOT NULL,

    UNIQUE INDEX `id`(`id`),
    INDEX `ticket_documents_ticketId_fkey`(`ticketId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket_comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` TEXT NOT NULL,
    `ticketId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `id`(`id`),
    INDEX `ticket_comments_ticketId_fkey`(`ticketId`),
    INDEX `ticket_comments_userId_fkey`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_subscriptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `subscription_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `id`(`id`),
    INDEX `user_subscriptions_userId_fkey`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `portfolios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `filters` JSON NOT NULL,
    `table_name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `id`(`id`),
    INDEX `portfolios_userId_fkey`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket_documents` ADD CONSTRAINT `ticket_documents_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `tickets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket_comments` ADD CONSTRAINT `ticket_comments_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `tickets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket_comments` ADD CONSTRAINT `ticket_comments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_subscriptions` ADD CONSTRAINT `user_subscriptions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `portfolios` ADD CONSTRAINT `portfolios_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
