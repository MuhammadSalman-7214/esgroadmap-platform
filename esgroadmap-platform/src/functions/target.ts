import columns from '@/constants/columns'
import { TableData } from '@/types/function'
import transformTableData from '@/utils/transform-table-data'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { cache } from 'react'
import { TargetTables } from '@/types/target'
import { getMockSentenceCarbonData } from '@/mocks/targets'

export type TargetSentenceData = TableData<
  Prisma.$SentenceAllViewPayload,
  typeof columns.TargetSentenceView
>

const getSentenceAllCompanyData = async () => {
  const data = await prisma.sentenceAllView.findMany({
    select: {
      id: true,
      Company: true,
      DocURL: true,
      Target_sentence: true,
      SentenceTargetYear: true,
      Country: true,
      sector_code__1__NAICS_: true,
      sector_name__1__NAICS_: true,
      upload_date: true,
    },
  })

  return transformTableData(
    data,
    columns.TargetSentenceView,
  ) as TargetSentenceData[]
}

const getSentenceCarbonData = async () => {
  const data = await prisma.sentenceCarbonView.findMany({
    select: {
      id: true,
      Company: true,
      DocURL: true,
      Target_sentence: true,
      SentenceTargetYear: true,
      Country: true,
      sector_code__1__NAICS_: true,
      sector_name__1__NAICS_: true,
      upload_date: true,
    },
  })

  return transformTableData(
    data,
    columns.TargetSentenceView,
  ) as TargetSentenceData[]
}

const getSentenceGenderData = async () => {
  const data = await prisma.sentenceGenderView.findMany({
    select: {
      id: true,
      Company: true,
      DocURL: true,
      Target_sentence: true,
      SentenceTargetYear: true,
      Country: true,
      sector_code__1__NAICS_: true,
      sector_name__1__NAICS_: true,
      upload_date: true,
    },
  })

  return transformTableData(
    data,
    columns.TargetSentenceView,
  ) as TargetSentenceData[]
}

const getSentenceWaterData = async () => {
  const data = await prisma.sentenceWaterView.findMany({
    select: {
      id: true,
      Company: true,
      DocURL: true,
      Target_sentence: true,
      SentenceTargetYear: true,
      Country: true,
      sector_code__1__NAICS_: true,
      sector_name__1__NAICS_: true,
      upload_date: true,
    },
  })

  return transformTableData(
    data,
    columns.TargetSentenceView,
  ) as TargetSentenceData[]
}

const getSentenceWasteData = async () => {
  const data = await prisma.sentenceWasteView.findMany({
    select: {
      id: true,
      Company: true,
      DocURL: true,
      Target_sentence: true,
      SentenceTargetYear: true,
      Country: true,
      sector_code__1__NAICS_: true,
      sector_name__1__NAICS_: true,
      upload_date: true,
    },
  })

  return transformTableData(
    data,
    columns.TargetSentenceView,
  ) as TargetSentenceData[]
}

const getSentenceSupplierData = async () => {
  const data = await prisma.sentenceSuppliersView.findMany({
    select: {
      id: true,
      Company: true,
      DocURL: true,
      Target_sentence: true,
      SentenceTargetYear: true,
      Country: true,
      sector_code__1__NAICS_: true,
      sector_name__1__NAICS_: true,
      upload_date: true,
    },
  })

  return transformTableData(
    data,
    columns.TargetSentenceView,
  ) as TargetSentenceData[]
}

const getSentenceRenewablesData = async () => {
  const data = await prisma.sentenceRenewablesView.findMany({
    select: {
      id: true,
      Company: true,
      DocURL: true,
      Target_sentence: true,
      SentenceTargetYear: true,
      Country: true,
      sector_code__1__NAICS_: true,
      sector_name__1__NAICS_: true,
      upload_date: true,
    },
  })

  return transformTableData(
    data,
    columns.TargetSentenceView,
  ) as TargetSentenceData[]
}

const getCarbonData = cache(() => {
  if (
    process.env.USE_MOCK_TARGETS === "true"
  ) {
    return getMockSentenceCarbonData();
  } else {
    return getSentenceCarbonData();
  }
});

const targetSentences: Record<
  TargetTables,
  () => Promise<TargetSentenceData[]>
> = {
  "waste_&_recycling": cache(getSentenceWasteData),
  carbon_reduction: getCarbonData,
  gender_diversity: cache(getSentenceGenderData),
  renewables: cache(getSentenceRenewablesData),
  supply_chain: cache(getSentenceSupplierData),
  water_management: cache(getSentenceWaterData),
  all_company: cache(getSentenceAllCompanyData),
};


const target =  {
  get(tableName: TargetTables) {
    return targetSentences[tableName]();
  }
}

export default target;