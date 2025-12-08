//

import { z } from "zod";

/* ---------- Primitive / helper schemas ---------- */

export const ImageFormatSchema = z.object({
  ext: z.string(),
  url: z.string(),
  hash: z.string(),
  mime: z.string(),
  name: z.string(),
  path: z.string().nullable(),
  size: z.number(),
  width: z.number().int(),
  height: z.number().int(),
  sizeInBytes: z.number().int(),
});

export const ImageSchema = z.object({
  id: z.number().int(),
  documentId: z.string(),
  name: z.string(),
  alternativeText: z.string().nullable(),
  caption: z.string().nullable(),
  width: z.number().int(),
  height: z.number().int(),
  formats: z
    .object({
      thumbnail: ImageFormatSchema.optional(),
    })
    .optional(),
  hash: z.string(),
  ext: z.string(),
  mime: z.string(),
  size: z.number(),
  url: z.string(),
  previewUrl: z.string().nullable(),
  provider: z.string(),
  provider_metadata: z.any(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
});

export const LocationOnMapSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const OfferSchema = z.object({
  id: z.number().int(),
  paymentPercentage: z.number(),
  paymentDuration: z.number().int(),
  paymentType: z.string(),
  title: z.string(),
  isActive: z.boolean(),
});

export const OriginalPlanSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  down_payment: z.union([z.string(), z.number()]),
  monthly_payment: z.number(),
  duration_years: z.number().int(),
});

/* ---------- Recursive schemas (use z.lazy for circular refs) ---------- */

export const CompoundSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.number().int(),
    documentId: z.string(),
    name: z.string(),
    startPrice: z.string(),
    locationOnMap: LocationOnMapSchema.optional().nullable(),
    slug: z.string(),
    amenities: z.array(z.string()),
    isNewLaunch: z.boolean(),
    isRecommended: z.boolean(),
    isTrendingProject: z.boolean(),
    description: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    publishedAt: z.string(),
    imageGallery: z.array(ImageSchema).optional().nullable(),
    masterPlanImage: z.array(ImageSchema).optional().nullable(),
    area: z
      .lazy(() => AreaSchema)
      .optional()
      .nullable(),
    properties: z
      .array(z.lazy(() => PropertySchema))
      .optional()
      .nullable(),
    developer: z
      .lazy(() => DeveloperSchema)
      .optional()
      .nullable(),
    Offers: z.array(OfferSchema).optional().nullable(),
  })
);

export const PropertySchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.number().int(),
    documentId: z.string(),
    name: z.string(),
    startPrice: z.string(),
    propertyType: z.string(),
    bathrooms: z.number().int(),
    bedrooms: z.number().int(),
    squareMeters: z.number().int(),
    deliveryIn: z.number().int(),
    finishing: z.string(),
    slug: z.string(),
    isRecommended: z.boolean(),
    isResale: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
    publishedAt: z.string(),
    imageGallery: z.array(ImageSchema).optional().nullable(),
    floorPlanImage: z.array(ImageSchema).optional().nullable(),
    masterPlanImage: z
      .union([ImageSchema, z.array(ImageSchema)])
      .optional()
      .nullable(),
    compound: z
      .lazy(() => CompoundSchema)
      .optional()
      .nullable(),
    originalPlan: OriginalPlanSchema.optional().nullable(),
  })
);

export const DeveloperSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.number().int(),
    documentId: z.string(),
    name: z.string(),
    startPrice: z.number(),
    slug: z.string(),
    description: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    publishedAt: z.string(),
    logo: ImageSchema.optional(),
    compounds: z.array(z.lazy(() => CompoundSchema)).optional(),
    areas: z.array(z.lazy(() => AreaSchema)).optional(),
  })
);

export const AreaSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.number().int(),
    documentId: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    isRecommended: z.boolean(),
    banner: ImageSchema.optional(),
    compounds: z
      .array(z.lazy(() => CompoundSchema))
      .optional()
      .nullable(),
    developers: z
      .array(z.lazy(() => DeveloperSchema))
      .optional()
      .nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    publishedAt: z.string(),
  })
);

/* ---------- API response / pagination helper ---------- */

export const PaginationSchema = z.object({
  page: z.number().int(),
  pageSize: z.number().int(),
  pageCount: z.number().int(),
  total: z.number().int(),
});

export const ApiMetaSchema = z.object({
  pagination: PaginationSchema.optional(),
});

export function ApiResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    data: z.array(itemSchema),
    meta: ApiMetaSchema.optional(),
  });
}

/* ---------- exported TypeScript types ---------- */

export type ImageFormat = z.infer<typeof ImageFormatSchema>;
export type Image = z.infer<typeof ImageSchema>;
export type LocationOnMap = z.infer<typeof LocationOnMapSchema>;
export type Offer = z.infer<typeof OfferSchema>;
export type OriginalPlan = z.infer<typeof OriginalPlanSchema>;
export type Compound = z.infer<typeof CompoundSchema>;
export type Property = z.infer<typeof PropertySchema>;
export type Developer = z.infer<typeof DeveloperSchema>;
export type Area = z.infer<typeof AreaSchema>;

export type ApiResponse<T> = z.infer<
  ReturnType<typeof ApiResponseSchema<T extends any ? any : any>>
>;

/* ---------- convenience exports for common responses ---------- */

export const CompoundResponseSchema = ApiResponseSchema(CompoundSchema);
export const PropertyResponseSchema = ApiResponseSchema(PropertySchema);
export const DeveloperResponseSchema = ApiResponseSchema(DeveloperSchema);
export const AreaResponseSchema = ApiResponseSchema(AreaSchema);
