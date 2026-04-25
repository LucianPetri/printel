export const podCategories = {
  simple: {
    category_id: 101,
    print_on_demand_enabled: true,
    print_on_demand_min: 5,
    print_on_demand_max: 7,
    print_on_demand_unit: 'days'
  },
  complex: {
    category_id: 202,
    print_on_demand_enabled: true,
    print_on_demand_min: 2,
    print_on_demand_max: 3,
    print_on_demand_unit: 'weeks'
  },
  premium: {
    category_id: 303,
    print_on_demand_enabled: true,
    print_on_demand_min: 4,
    print_on_demand_max: 4,
    print_on_demand_unit: 'weeks'
  },
  standard: {
    category_id: 404,
    print_on_demand_enabled: false,
    print_on_demand_min: null,
    print_on_demand_max: null,
    print_on_demand_unit: null
  }
};

export const podProducts = {
  simpleOutOfStock: {
    product_id: 11,
    category_id: podCategories.simple.category_id,
    sku: 'pod-simple-out',
    qty: 0,
    manage_stock: true,
    stock_availability: true
  },
  complexOutOfStock: {
    product_id: 12,
    category_id: podCategories.complex.category_id,
    sku: 'pod-complex-out',
    qty: 0,
    manage_stock: true,
    stock_availability: true
  },
  premiumOutOfStock: {
    product_id: 13,
    category_id: podCategories.premium.category_id,
    sku: 'pod-premium-out',
    qty: 0,
    manage_stock: true,
    stock_availability: true
  },
  simpleInStock: {
    product_id: 14,
    category_id: podCategories.simple.category_id,
    sku: 'pod-simple-in',
    qty: 6,
    manage_stock: true,
    stock_availability: true
  },
  standardOutOfStock: {
    product_id: 15,
    category_id: podCategories.standard.category_id,
    sku: 'standard-out',
    qty: 0,
    manage_stock: true,
    stock_availability: true
  }
};
