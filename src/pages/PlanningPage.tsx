import {
  ColDef,
  ColGroupDef,
  CellValueChangedEvent,
  GridReadyEvent,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useState, useRef } from 'react';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const calendarData = [
  { week: 'W01', month: 'Feb' },
  { week: 'W02', month: 'Feb' },
  { week: 'W03', month: 'Feb' },
  { week: 'W04', month: 'Feb' },
  { week: 'W05', month: 'Mar' },
  { week: 'W06', month: 'Mar' },
  { week: 'W07', month: 'Mar' },
  { week: 'W08', month: 'Mar' },
  { week: 'W09', month: 'Mar' },
  { week: 'W10', month: 'Apr' },
];

const initialRowData = [
  {
    store: 'Chicago Charm Boutique',
    sku: 'Floral Chiffon Wrap Dress',
    price: 150.0,
    cost: 50.0,
    weeksData: [
      { week: 'Week 01', salesUnits: 200 },
      { week: 'Week 02', salesUnits: 0 },
    ],
  },
  {
    store: 'Miami Breeze Apparel',
    sku: 'Lace-Up Combat Boots',
    price: 80.0,
    cost: 30.0,
    weeksData: [
      { week: 'Week 01', salesUnits: 199 },
      { week: 'Week 02', salesUnits: 14 },
    ],
  },
];

const formatInitialRowData = () => {
  return initialRowData.map((row) => {
    let formattedRow: Record<string, any> = { store: row.store, sku: row.sku };

    row.weeksData.forEach((week) => {
      const salesUnits = week.salesUnits || 0;
      const salesDollars = salesUnits * row.price;
      const gmDollars = salesDollars - salesUnits * row.cost;
      const gmPercent =
        salesDollars > 0
          ? Number(((gmDollars / salesDollars) * 100).toFixed(2))
          : 0;

      formattedRow[`${week.week}_salesUnits`] = salesUnits;
      formattedRow[`${week.week}_salesDollars`] = salesDollars;
      formattedRow[`${week.week}_gmDollars`] = gmDollars;
      formattedRow[`${week.week}_gmPercent`] = gmPercent;
    });

    return formattedRow;
  });
};

const Planning = () => {
  const gridRef = useRef<AgGridReact>(null);
  const gridApiRef = useRef<any>(null);
  const priceAndCostData = useRef(
    initialRowData.map((item) => ({
      sku: item.sku,
      price: item.price,
      cost: item.cost,
    }))
  );

  const [rowData, setRowData] = useState(formatInitialRowData());

  const onGridReady = (params: GridReadyEvent) => {
    gridApiRef.current = params.api;
  };

  const onCellValueChanged = (params: CellValueChangedEvent) => {
    if (!params.column || isNaN(Number(params.newValue))) return;

    const field = params.column.getColId();
    if (field.includes('_salesUnits')) {
      const weekKey = field.split('_')[0]; // Extract week key (e.g., "Week 01")
      const sku = params.data.sku;
      const newSalesUnits = Number(params.newValue);

      const itemData = priceAndCostData.current.find(
        (item) => item.sku === sku
      );
      if (!itemData) return;

      const { price, cost } = itemData;
      const newSalesDollars = newSalesUnits * price;
      const newGmDollars = newSalesDollars - newSalesUnits * cost;

      const newGmPercent =
        newSalesDollars > 0
          ? Number(((newGmDollars / newSalesDollars) * 100).toFixed(2))
          : 0;
      console.log(
        'newSalesDollars',
        newSalesDollars,
        'newGmPercent',
        newGmPercent,
        'newSalesDollars',
        newSalesDollars,
        'newGmDollars',
        newGmDollars
      );

      // console.log('SKU:', sku);
      // console.log('New Sales Units:', newSalesUnits);
      // console.log('Price per Unit:', price);
      // console.log('Cost per Unit:', cost);
      // console.log('New Sales $:', newSalesDollars);
      // console.log('New GM $:', newGmDollars);
      // console.log('New GM %:', newGmPercent);

      setRowData((prevRowData) => {
        const updatedData = prevRowData.map((row) =>
          row.sku === sku
            ? {
                ...row,
                [`${weekKey}_salesUnits`]: newSalesUnits,
                [`${weekKey}_salesDollars`]: newSalesDollars,
                [`${weekKey}_gmDollars`]: newGmDollars,
                [`${weekKey}_gmPercent`]: newGmPercent,
              }
            : row
        );

        return [...updatedData]; //  Return new array to trigger UI update
      });

      if (gridApiRef.current) {
        gridApiRef.current.applyTransaction({ update: [{ ...params.data }] });
        gridApiRef.current.refreshCells({
          force: true,
          rowNodes: [params.node],
          columns: [
            `${weekKey}_salesUnits`,
            `${weekKey}_salesDollars`,
            `${weekKey}_gmDollars`,
            `${weekKey}_gmPercent`,
          ],
        });
      }
    }
  };

  const gmPercentCellStyle = (params: any) => {
    if (params.value >= 40)
      return { backgroundColor: 'hsl(122.55deg 40.87% 45.1%)', color: 'white' };
    if (params.value >= 10)
      return { backgroundColor: 'hsl(48deg 95.83% 52.94%)', color: 'black' };
    if (params.value >= 5)
      return { backgroundColor: 'hsl(27.02deg 95.98% 60.98%)', color: 'black' };
    return { backgroundColor: 'hsl(0deg 95.65% 81.96%)', color: 'white' };
  };
  const columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: 'Store',
      field: 'store',
      headerClass: 'custom-header',

      pinned: 'left',
      width: 200,
      editable: false,
    },
    {
      headerName: 'SKU',
      field: 'sku',
      pinned: 'left',
      headerClass: 'custom-header',
      width: 250,
      editable: false,
    },
    ...calendarData.map(
      (week): ColGroupDef => ({
        headerName: week.month,
        headerClass: 'custom-header',
        children: [
          {
            headerName: week.week,
            headerClass: 'custom-header',
            children: [
              {
                headerName: 'Sales Units',
                field: `${week.week}_salesUnits`,
                width: 120,
                headerClass: 'custom-header',
                editable: true,
              },
              {
                headerName: 'Sales Dollars',
                field: `${week.week}_salesDollars`,
                headerClass: 'custom-header',
                valueFormatter: (p) =>
                  p.value != null ? `$${p.value.toFixed(2)}` : '$0.00',
                width: 120,
                editable: false,
              },
              {
                headerName: 'GM Dollars',
                field: `${week.week}_gmDollars`,
                headerClass: 'custom-header',
                valueFormatter: (p) =>
                  p.value != null ? `$${p.value.toFixed(2)}` : '$0.00',
                width: 120,
                editable: false,
              },
              {
                headerName: 'GM Percent',
                field: `${week.week}_gmPercent`,
                headerClass: 'custom-header',
                valueFormatter: (p) =>
                  p.value != null ? `${p.value.toFixed(2)}%` : '0.00%',
                width: 100,
                editable: false,
                cellStyle: gmPercentCellStyle,
              },
            ],
          },
        ],
      })
    ),
  ];

  return (
    <div className="sku-container sku-table ag-theme-alpine rounded-none">
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{ resizable: true, sortable: true }}
        onGridReady={onGridReady}
        onCellValueChanged={onCellValueChanged}
        getRowId={(params) => params.data.sku}
        animateRows={true}
      />
    </div>
  );
};

export default Planning;
