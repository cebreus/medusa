import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import { simpleProductFactory } from "../../../../factories"

import {
  IPricingModuleService,
  PriceListStatus,
  PriceListType,
} from "@medusajs/types"
import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import adminSeeder from "../../../../helpers/admin-seeder"
import { createVariantPriceSet } from "../../../helpers/create-variant-price-set"

jest.setTimeout(50000)

const adminHeaders = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

const env = {
  MEDUSA_FF_ISOLATE_PRICING_DOMAIN: true,
  MEDUSA_FF_ISOLATE_PRODUCT_DOMAIN: true,
}

describe("[Product & Pricing Module] GET /admin/price-lists/:id/products", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let product
  let product2
  let variant
  let variant2
  let pricingModuleService: IPricingModuleService

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    pricingModuleService = appContainer.resolve("pricingModuleService")
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  beforeEach(async () => {
    await adminSeeder(dbConnection)

    product = await simpleProductFactory(dbConnection, {
      id: "test-product-with-variant",
      title: "uniquely fun product",
      variants: [
        {
          options: [{ option_id: "test-product-option-1", value: "test" }],
        },
      ],
      options: [
        {
          id: "test-product-option-1",
          title: "Test option 1",
        },
      ],
    })

    variant = product.variants[0]

    product2 = await simpleProductFactory(dbConnection, {
      id: "test-product-with-variant-2",
      title: "uniquely fun product 2",
      variants: [
        {
          options: [{ option_id: "test-product-option-2", value: "test 2" }],
        },
      ],
      options: [
        {
          id: "test-product-option-2",
          title: "Test option 2",
        },
      ],
    })

    variant2 = product2.variants[0]
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should get all products under a price list", async () => {
    const priceSet = await createVariantPriceSet({
      container: appContainer,
      variantId: variant.id,
      prices: [
        {
          amount: 3000,
          currency_code: "usd",
          rules: {},
        },
      ],
      rules: [],
    })

    const [priceList] = await pricingModuleService.createPriceLists([
      {
        title: "test price list",
        description: "test",
        ends_at: new Date(),
        starts_at: new Date(),
        status: PriceListStatus.ACTIVE,
        type: PriceListType.OVERRIDE,
        prices: [
          {
            amount: 5000,
            currency_code: "usd",
            price_set_id: priceSet.id,
          },
        ],
      },
    ])

    const api = useApi() as any

    const response = await api.get(
      `/admin/price-lists/${priceList.id}/products`,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.count).toEqual(1)
    expect(response.data.products).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
        handle: expect.any(String),
        subtitle: null,
        description: null,
        is_giftcard: false,
        status: "draft",
        thumbnail: null,
        weight: null,
        length: null,
        height: null,
        width: null,
        origin_country: null,
        hs_code: null,
        mid_code: null,
        material: null,
        collection_id: null,
        collection: null,
        type_id: null,
        type: null,
        discountable: true,
        external_id: null,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        deleted_at: null,
        metadata: null,
        variants: [
          expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String),
            sku: null,
            barcode: null,
            ean: null,
            upc: null,
            inventory_quantity: 10,
            allow_backorder: false,
            manage_inventory: true,
            hs_code: null,
            origin_country: null,
            mid_code: null,
            material: null,
            weight: null,
            length: null,
            height: null,
            width: null,
            metadata: null,
            variant_rank: 0,
            product_id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
          }),
        ],
      }),
    ])
  })

  it("should get all products with a search under a price list", async () => {
    const priceSet = await createVariantPriceSet({
      container: appContainer,
      variantId: variant.id,
      prices: [
        {
          amount: 3000,
          currency_code: "usd",
          rules: {},
        },
      ],
      rules: [],
    })

    const [priceList] = await pricingModuleService.createPriceLists([
      {
        title: "test price list",
        description: "test",
        ends_at: new Date(),
        starts_at: new Date(),
        status: PriceListStatus.ACTIVE,
        type: PriceListType.OVERRIDE,
        prices: [
          {
            amount: 5000,
            currency_code: "usd",
            price_set_id: priceSet.id,
          },
        ],
      },
    ])

    const api = useApi() as any

    let response = await api.get(
      `/admin/price-lists/${priceList.id}/products?q=shouldnotreturnanything`,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.count).toEqual(0)
    expect(response.data.products).toEqual([])

    response = await api.get(
      `/admin/price-lists/${priceList.id}/products?q=uniquely`,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.count).toEqual(1)
    expect(response.data.products).toEqual([
      expect.objectContaining({
        id: expect.any(String),
      }),
    ])

    response = await api.get(
      `/admin/price-lists/${priceList.id}/products?q=`,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.count).toEqual(1)
    expect(response.data.products).toEqual([
      expect.objectContaining({
        id: expect.any(String),
      }),
    ])
  })
})
