import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useSelector, useDispatch } from 'src/redux/store';
import { getProduct, deleteProduct, cleanProductData } from 'src/redux/slices/product';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import TableRowBloqueios from 'src/components/TableToobar/TableRow';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
} from 'src/components/table';

import { Product } from 'src/types/product';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nome' },
  { id: 'createdAt', label: 'Descrição', width: 260 },
  { id: 'inventoryType', label: 'Valor', width: 160 },
  { id: '', label: 'Opções', width: 110 },
];

// ----------------------------------------------------------------------

export default function CoverProducts() {
  const router = useRouter();

  const dispatch = useDispatch();

  const table = useTable();

  const [tableData, setTableData] = useState<Product[]>([]);
  const [filters] = useState();

  const confirm = useBoolean();

  const { dataGrid, isLoading } = useSelector((state) => state.product);

  const rowsEmpty = !isLoading && !dataGrid?.rows.length;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(getProduct());
      } catch (error) {
        console.error('Erro ao recuperar dados:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && dataGrid) {
      setTableData(dataGrid.rows);
    }
  }, [dataGrid, isLoading]);

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual('', filters);

  const notFound = (!dataFiltered.length && canReset) || rowsEmpty;

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteProduct(id));
        setTableData((prevTableData) => prevTableData.filter((row) => row.id !== id));
        await dispatch(getProduct());
      } catch (error) {
        console.error('Erro ao excluir linha:', error);
      }
    },
    [dispatch]
  );

  const handleEditRow = useCallback(
    (id: string) => {
      dispatch(cleanProductData());
      router.push(paths.product.edit(id));
    },
    [router, dispatch]
  );

  return (
    <>
      <Box>
        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {isLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {dataFiltered
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row) => (
                          <TableRowBloqueios
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                          />
                        ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Card>
      </Box>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Tem certeza que desejar excluir <strong> {table.selected.length} </strong> bloqueios?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse();
            }}
          >
            Exluir
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
}: {
  inputData: Product[];
  comparator: (a: any, b: any) => number;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
