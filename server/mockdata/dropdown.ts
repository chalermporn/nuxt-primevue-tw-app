export const ddl = {
    statuses: [
        { label: 'INSTOCK', value: 'instock' },
        { label: 'LOWSTOCK', value: 'lowstock' },
        { label: 'OUTOFSTOCK', value: 'outofstock' }
    ],
    category: [
        { label: 'Accessories', value: 'accessories' },
        { label: 'Clothing', value: 'clothing' },
        { label: 'Electronics', value: 'electronics' },
        { label: 'Fitness', value: 'fitness' },
    ],
    filterOptions: [
        { label: 'Name', value: 'name' },
        { label: 'Price', value: 'price' },
        { label: 'Category', value: 'category' },
        { label: 'Rating', value: 'rating' },
        { label: 'Status', value: 'status' },
    ],
    rowPerPage: [
        { label: '5', value: '5' },
        { label: '10', value: '10' },
    ],
    displayTableColumn: [
        { field: 'image', header: 'Image' },
        { field: 'name', header: 'Name', minWidth: '8rem' },
        { field: 'price', header: 'Price', minWidth: '8rem' },
        { field: 'category', header: 'Category', minWidth: '10rem' },
        { field: 'rating', header: 'Rating', minWidth: '12rem' },
        { field: 'inventoryStatus', header: 'Status', minWidth: '12rem' },
    ],
};