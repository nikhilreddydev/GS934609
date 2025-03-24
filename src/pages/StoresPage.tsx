import { useEffect, useState, useRef } from 'react';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  ModuleRegistry,
  ClientSideRowModelModule,
  AllCommunityModule,
} from 'ag-grid-community';
import { v4 as uuidv4 } from 'uuid';
import { RiDeleteBin6Line } from 'react-icons/ri';

ModuleRegistry.registerModules([ClientSideRowModelModule, AllCommunityModule]);

interface StoreInterface {
  id?: string;
  name: string;
  city: string;
  state: string;
}

const StoresPage = () => {
  const [rowData, setRowData] = useState<StoreInterface[]>([]);
  const [tempData, setTempData] = useState<StoreInterface[]>([]);
  const gridRef = useRef<AgGridReact<StoreInterface>>(null);

  const handleAddStore = () => {
    setTempData((prev) => [...prev, { name: '', city: '', state: '' }]);
  };

  const onCellValueChanged = (params: any) => {
    if (params.data.name.trim() !== '') {
      if (!params.data.id) {
        const newStore = { ...params.data, id: uuidv4() };
        setRowData((prev) => [...prev, newStore]);
        setTempData((prev) => prev.filter((row) => row !== params.data));
      } else {
        setRowData((prev) =>
          prev.map((row) =>
            row.id === params.data.id ? { ...row, ...params.data } : row
          )
        );
      }
    }
  };

  const handleDelete = (id?: string, row?: StoreInterface) => {
    if (id) {
      setRowData((prev) => prev.filter((store) => store.id !== id));
    } else {
      setTempData((prev) => prev.filter((store) => store !== row));
    }
  };

  const colDefs: ColDef<StoreInterface>[] = [
    {
      headerName: '',
      width: 80,
      cellRenderer: (params: { data?: StoreInterface }) =>
        params.data ? (
          <button
            className="px-4 py-2 rounded bg-transparent text-gray-700 p-0 m-0 flex items-center justify-center cursor-pointer"
            onClick={() => handleDelete(params.data?.id, params.data)}>
            <RiDeleteBin6Line size={18} />
          </button>
        ) : null,
      cellStyle: { padding: '4px', textAlign: 'center' },
      headerClass: 'custom-header',
    },
    {
      headerName: 'S.No',
      valueGetter: (params) =>
        [...rowData, ...tempData].findIndex((store) => store === params.data) +
        1,
      width: 80,
      headerClass: 'custom-header',
    },
    {
      headerName: 'Store',
      field: 'name',
      editable: true,
      width: 250,
      cellClass: 'border-right',
      headerClass: 'border-right custom-header',
    },
    {
      headerName: 'City',
      field: 'city',
      editable: true,
      width: 200,
      headerClass: 'custom-header',
    },
    {
      headerName: 'State',
      field: 'state',
      editable: true,
      width: 100,
      headerClass: 'custom-header',
    },
  ];

  useEffect(() => {
    setRowData([
      {
        id: uuidv4(),
        name: 'Atlanta Outfitters',
        city: 'Atlanta',
        state: 'GA',
      },
      {
        id: uuidv4(),
        name: 'Chicago Charm Boutique',
        city: 'Chicago',
        state: 'IL',
      },
      {
        id: uuidv4(),
        name: 'Houston Harvest Market',
        city: 'Houston',
        state: 'TX',
      },
      {
        id: uuidv4(),
        name: 'Seattle Skyline Goods',
        city: 'Seattle',
        state: 'WA',
      },
      {
        id: uuidv4(),
        name: 'Miami Breeze Apparel',
        city: 'Miami',
        state: 'FL',
      },
    ]);
  }, []);

  return (
    <div className="sku-container">
      <div className="sku-table ag-theme-alpine rounded-none">
        <AgGridReact
          ref={gridRef}
          rowData={[...rowData, ...tempData]}
          columnDefs={colDefs}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
      <button
        className="sku-button bg-green-500 cursor-pointer text-gray-800 px-4 py-2 mt-4 rounded shadow-md flex items-center gap-2"
        onClick={handleAddStore}>
        NEW STORE
      </button>
    </div>
  );
};

export default StoresPage;
