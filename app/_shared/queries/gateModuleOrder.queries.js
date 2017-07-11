export const GATE_MODULE_NEW_ORDER = `mutation orderModuleMutation($module: ModuleOrderInput!) {
  create_module_order(module_order: $module) {
    id
    payment_url
  }
}
`
