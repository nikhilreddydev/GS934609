import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlanningState {
  rowData: any[];
}

const initialState: PlanningState = {
  rowData: [],
};

const planningSlice = createSlice({
  name: 'planning',
  initialState,
  reducers: {
    setRowData(state, action: PayloadAction<any[]>) {
      state.rowData = action.payload;
    },
    updateRow(state, action: PayloadAction<any>) {
      const updatedRow = action.payload;
      state.rowData = state.rowData.map((row) =>
        row.sku === updatedRow.sku ? updatedRow : row
      );
    },
  },
});

export const { setRowData, updateRow } = planningSlice.actions;
export default planningSlice.reducer;
