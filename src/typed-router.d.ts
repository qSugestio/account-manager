declare module "vue-router/auto-routes" {
  import type { RouteRecordInfo } from "vue-router";

  export interface RouteNamedMap {
    "/": RouteRecordInfo<"/", "/", Record<never, never>, Record<never, never>>;
  }
}
