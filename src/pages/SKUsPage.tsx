import React, { useState, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { v4 as uuidv4 } from 'uuid';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { ColDef } from 'ag-grid-community';

// ✅ Define RowData Interface
interface RowData {
  id: string;
  sku: string;
  price: number;
  cost: number;
}

const SKUPage: React.FC = () => {
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const [rowData, setRowData] = useState<RowData[]>([
    { id: uuidv4(), sku: 'Cotton Polo Shirt', price: 139.99, cost: 10.78 },
    { id: uuidv4(), sku: 'Tassel Fringe Handbag', price: 134.99, cost: 20.79 },
    {
      id: uuidv4(),
      sku: 'Minimalist Leather Watch',
      price: 49.99,
      cost: 49.89,
    },
  ]);

  const [tempRows, setTempRows] = useState<RowData[]>([]); // Temporary new rows

  // ✅ Explicitly Typed Column Definitions
  const columnDefs: ColDef<RowData>[] = [
    {
      headerName: '',
      cellRenderer: (params: any) => (
        <button
          className="px-4 py-2 rounded bg-transparent text-gray-700 p-0 m-0 flex items-center justify-center cursor-pointer"
          onClick={() => handleRemoveSKU(params.node.rowIndex)}>
          <RiDeleteBin6Line size={18} />
        </button>
      ),
      width: 30,
      maxWidth: 60,
      minWidth: 30,
      cellStyle: { padding: '4px', textAlign: 'center' },
      headerClass: 'custom-header',
    },
    {
      headerName: 'SKU',
      field: 'sku' as keyof RowData,
      width: 90,
      editable: true,
      cellClass: 'border-right',
      headerClass: 'border-right custom-header',
    },
    {
      headerName: 'Price',
      field: 'price' as keyof RowData,
      editable: true,
      valueFormatter: (params) => `$ ${Number(params.value).toFixed(2)}`,
      headerClass: 'custom-header',
    },
    {
      headerName: 'Cost',
      field: 'cost' as keyof RowData,
      editable: true,
      valueFormatter: (params) => `$ ${Number(params.value).toFixed(2)}`,
      headerClass: 'custom-header',
    },
  ];

  const handleAddSKU = (): void => {
    setTempRows([
      ...tempRows,
      { id: uuidv4(), sku: '', price: 0.0, cost: 0.0 },
    ]);
  };

  const handleRemoveSKU = (index: number): void => {
    setRowData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleCellValueChanged = useCallback((params: { data: RowData }) => {
    const { data } = params;

    if (data.sku.trim() !== '') {
      if (data.id) {
        // Update existing row
        setRowData((prevData) =>
          prevData.map((row) =>
            row.id === data.id ? { ...row, ...data } : row
          )
        );
      } else {
        // Create new row with UUID
        const newRow = { ...data, id: uuidv4() };
        setRowData((prevData) => [...prevData, newRow]);
        setTempRows((prevRows) => prevRows.filter((row) => row !== data));
      }
    }
  }, []);

  return (
    <div className="sku-container">
      {/* Scrollable Table */}
      <div className="sku-table ag-theme-alpine rounded-none">
        <AgGridReact
          ref={gridRef}
          rowData={[...rowData, ...tempRows]}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          defaultColDef={{ flex: 1, resizable: true }}
          animateRows={true}
          onCellValueChanged={handleCellValueChanged} // Detect SKU, Price, or Cost input
        />
      </div>

      {/* Fixed Button */}
      <button className="sku-button" onClick={handleAddSKU}>
        NEW SKU
      </button>
    </div>
  );
};

export default SKUPage;
