/* eslint-disable import/no-extraneous-dependencies */
import { Dispatch, createSlice, PayloadAction } from '@reduxjs/toolkit';

import httpRequest from 'src/utils/httpRequest';

import { Product } from 'src/types/product';

// ----------------------------------------------------------------------

const initialState: any = {
  isLoading: false,
  error: null,
  productData: {} as Product,
  dataGrid: {
    rows: [] as Product[],
  },
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    getProducts(state) {
      state.isLoading = true;
      state.error = false;
    },

    getProduct(state, action: PayloadAction<Product[]>) {
      state.isLoading = false;
      state.error = false;
      state.dataGrid.rows = action.payload;
    },

    getProductSucess(state, action: PayloadAction<Product>) {
      state.isLoading = false;
      state.error = false;
      state.productData = action.payload;
    },

    saveProduct(state) {
      state.isLoading = true;
      state.error = false;
    },

    saveProductSuccess(state) {
      state.isLoading = false;
      state.error = false;
    },

    deleteProduct(state) {
      state.isLoading = true;
      state.error = false;
    },
    deleteProductSucess(state) {
      state.isLoading = false;
      state.error = false;
    },

    cleanProductData(state) {
      state.productData = {} as Product;
    },
    error(state) {
      state.isLoading = false;
      state.error = true;
    },
  },
});

export const { cleanProductData } = slice.actions;
// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getProduct() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.getProducts());
    try {
      const response = await httpRequest(`/product`, undefined, 'get');
      const data: Product[] = response;
      dispatch(slice.actions.getProduct(data));
    } catch (error) {
      console.warn('Erro ao buscar informações da tabela', error);
    }
  };
}

export function createProduct(body: Product) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.saveProduct());
    try {
      await httpRequest(`/product`, body);
      dispatch(slice.actions.saveProductSuccess());
    } catch (error) {
      dispatch(slice.actions.error());
      return error;
    }
    return null;
  };
}

export function getProductId(id: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.getProducts());
    try {
      const response = await httpRequest(`/product/${id}`, undefined, 'get');
      dispatch(slice.actions.getProductSucess(response as Product));
    } catch (error) {
      console.warn('Erro ao buscar informações da tabela', error);
    }
  };
}

export function saveProduct(id: string, body: Product) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.saveProduct());
    try {
      await httpRequest(`/product/${id}`, body, 'patch');
      dispatch(slice.actions.saveProductSuccess());
    } catch (error) {
      console.warn('Erro ao salvar', error);
    }
  };
}

export function deleteProduct(id: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.deleteProduct());
    try {
      await httpRequest(`/product/${id}`, undefined, 'delete');
      dispatch(slice.actions.deleteProductSucess());
    } catch (error) {
      console.warn('Erro ao deletar', error);
    }
  };
}
