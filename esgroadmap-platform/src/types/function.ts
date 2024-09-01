import { Prisma } from '@prisma/client'
import { GetPayloadResult } from '@prisma/client/runtime/library'

export type ReverseMap<T extends Partial<Record<string, string>>, K extends keyof T = keyof T> = {
  [P in T[K] as string]: {
    [K in keyof T]: T[K] extends P ? K : never
  }[keyof T]
}

type ColumnNames<
  TObject extends object
> = TObject[keyof TObject]

// type ReverseColumnNames = ReverseMap<typeof columnNamesForPercentageTable>

type PrismaTables =
  | Prisma.$PercentageTablePayload
  | Prisma.$UniqueFactorsTablePayload
  | Prisma.$CompanyDataPayload
  | Prisma.$CompanyData2Payload
  | Prisma.$CompanyUniversePayload
  | Prisma.$TargetSentencePayload
  | Prisma.$RoadmapCarbonPayload
  | Prisma.$SentenceAllPayload
  | Prisma.$TestablePayload
  | Prisma.$SentenceCarbonViewPayload
  | Prisma.$SentenceGenderViewPayload
  | Prisma.$SentenceWaterViewPayload
  | Prisma.$SentenceWasteViewPayload
  | Prisma.$SentenceSuppliersViewPayload
  | Prisma.$SentenceRenewablesViewPayload
  | Prisma.$SentenceAllViewPayload

export type TableData<
  PrismaModel extends PrismaTables,
  TColumnMap extends Partial<Record<keyof PrismaModel['scalars'], string>>,
  Columns extends ColumnNames<TColumnMap> = ColumnNames<TColumnMap>,
  ReversedTColumMap extends ReverseMap<TColumnMap> = ReverseMap<TColumnMap>
> = {
  // @ts-ignore
  [key in Columns]: PrismaModel['scalars'][ReversedTColumMap[key]]
}

