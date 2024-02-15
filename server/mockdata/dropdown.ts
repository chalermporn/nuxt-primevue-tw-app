export const ddl = {
    statuses: [
        { label: 'INSTOCK', value: 'INSTOCK' },
        { label: 'LOWSTOCK', value: 'LOWSTOCK' },
        { label: 'OUTOFSTOCK', value: 'OUTOFSTOCK' }
    ],
    category: [
        { label: 'Accessories', value: 'Accessories' },
        { label: 'Clothing', value: 'Clothing' },
        { label: 'Electronics', value: 'Electronics' },
        { label: 'Fitness', value: 'Fitness' },
    ],
    filterOptions: [
        { label: 'Name', value: 'Name' },
        { label: 'Price', value: 'Price' },
        { label: 'Category', value: 'Category' },
        { label: 'Rating', value: 'Rating' },
        { label: 'Status', value: 'Status' },
    ],
    filterOptionsShowBy:[
        { label: 'All', value: 'All' },
        { label: 'Accessories', value: 'Accessories' },
        { label: 'Clothing', value: 'Clothing' },
        { label: 'Electronics', value: 'Electronics' },
        { label: 'Fitness', value: 'Fitness' },
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
        { field: 'status', header: 'Status', minWidth: '12rem' },
    ],
};