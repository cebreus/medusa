import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"
import { modulesConfig } from "../__fixtures__"

import { DB_URL } from "./database"

export function getInitModuleConfig() {
  const authenticationModuleOptions = {
    defaultAdapterOptions: {
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PRICING_DB_SCHEMA,
      },
    },
  }

  const injectedDependencies = {}

  const modulesConfig_ = {
    ...modulesConfig,
    [Modules.AUTHENTICATION]: {
      definition: ModulesDefinition[Modules.AUTHENTICATION],
      options: authenticationModuleOptions,
    },
  }

  return {
    injectedDependencies,
    modulesConfig: modulesConfig_,
    databaseConfig: {
      clientUrl: DB_URL,
      schema: process.env.MEDUSA_SEARCH_DB_SCHEMA,
    },
    joinerConfig: [],
  }
}
