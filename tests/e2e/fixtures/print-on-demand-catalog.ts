export const printOnDemandCatalogFixtures = {
  categories: {
    simple: {
      name: 'POD Category A',
      slug: 'pod-category-a',
      range: { min: 5, max: 7, unit: 'days' as const }
    },
    complex: {
      name: 'POD Category B',
      slug: 'pod-category-b',
      range: { min: 2, max: 3, unit: 'weeks' as const }
    },
    premium: {
      name: 'POD Category C',
      slug: 'pod-category-c',
      range: { min: 4, max: 4, unit: 'weeks' as const }
    }
  },
  products: {
    simpleOutOfStock: {
      name: 'POD Product A',
      sku: 'pod-product-a'
    },
    complexOutOfStock: {
      name: 'POD Product B',
      sku: 'pod-product-b'
    },
    premiumOutOfStock: {
      name: 'POD Product C',
      sku: 'pod-product-c'
    }
  }
};
