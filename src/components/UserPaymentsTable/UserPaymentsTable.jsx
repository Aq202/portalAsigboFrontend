/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './UserPaymentsTable.module.css';
import InputSearchSelect from '../InputSearchSelect/InputSearchSelect';
import Table from '../Table/Table';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import TableRow from '../TableRow/TableRow';
import Button from '../Button/Button';
import Pagination from '../Pagination/Pagination';

/**
 * Tabla de pagos de un usuario.
 * @param {string} idUser - ID del usuario.
 * @param {bool} userProfile - Indica si la tabla es utilizada en el perfil del usuario. Def false.
 * @returns
 */
function UserPaymentsTable({ idUser, userProfile }) {
  const [paymentState, setPaymentState] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [outstandingPayments, setOutstandingPayments] = useState(null);
  const token = useToken();

  const {
    callFetch: callPaymentsFetch, result: payments, loading: loadingPayments, error: errorPayments,
  } = useFetch();

  useEffect(() => {
    if (!idUser) return;

    const params = new URLSearchParams();

    params.append('state', paymentState);
    params.append('page', currentPage);

    callPaymentsFetch({
      uri: `${serverHost}/payment/assignment/user/${idUser}?${params.toString()}`,
      headers: { authorization: token },
    });
  }, [idUser, paymentState, currentPage]);

  useEffect(() => {
    // Al obtener valor de pagos, se actualiza una sola vez los datos de pagos pendientes
    if (!payments) return;

    setOutstandingPayments((prevValue) => {
      if (prevValue !== null) return prevValue;
      return payments.outstandingPayments;
    });
  }, [payments]);

  return (
    <div className={styles.userPaymentsTableContainer}>

      <div className={styles.outstandingPaymentsContainer}>
        <div className={styles.outstandingPaymentsItem}>
          <span className={styles.itemTitle}>Pagos pendientes</span>
          <span className={styles.itemValue}>
            {outstandingPayments?.num || 0}
          </span>
        </div>
        <div className={styles.outstandingPaymentsItem}>
          <span className={styles.itemTitle}>Total por pagar</span>
          <span className={styles.itemValue}>
            {`Q. ${parseFloat(outstandingPayments?.totalAmount || 0).toFixed(2)}`}
          </span>
        </div>
      </div>

      <div className={styles.filterContainer}>
        <InputSearchSelect
          className={styles.selectInput}
          placeholder="Estado (todos)"
          value={paymentState}
          onChange={(e) => setPaymentState(e.target.value)}
          options={
            [
              { title: 'Pagos pendientes', value: '0' },
              { title: 'Pagos completados', value: '1' },
              { title: 'Pagos confirmados', value: '2' },
              { title: 'Pagos atrazados', value: '3' },
            ]
          }
        />
      </div>
      <Table
        header={['No.', 'Concepto', 'Monto Q', 'Estado', '']}
        loading={loadingPayments}
        showNoResults={!!errorPayments}
        breakPoint="900px"
      >
        {payments?.result?.map((paymentAssign, index) => (
          <TableRow id={paymentAssign.id} key={paymentAssign.id}>
            <td>{index + 1}</td>
            <td>{paymentAssign.payment.name}</td>
            <td>{parseFloat(paymentAssign.payment.amount).toFixed(2)}</td>
            <td className={`${styles.statusRow} ${
              paymentAssign.confirmed ? styles.confirmedStatus
                : paymentAssign.completed ? styles.completedStatus
                  : styles.pendingStatus
            }`}
            >
              <span>
                {
                  paymentAssign.confirmed ? 'Confirmado'
                    : paymentAssign.completed ? 'Por revisar'
                      : 'Pendiente'
                }
              </span>
            </td>
            <td className={styles.buttonRow}>
              <Link to={userProfile ? `/pago/asignacion/${paymentAssign.id}` : `/mis-pagos/${paymentAssign.id}`}>
                <Button tableButton type="button" className={styles.assignmentDetailsButton}>Ver asignación</Button>
              </Link>
            </td>
          </TableRow>
        ))}
      </Table>
      <Pagination
        totalPages={payments?.pages}
        currentPage={currentPage + 1}
        onChange={(e, page) => setCurrentPage(page - 1)}
        className={styles.pagination}
      />
    </div>
  );
}

export default UserPaymentsTable;

UserPaymentsTable.propTypes = {
  idUser: PropTypes.string.isRequired,
  userProfile: PropTypes.bool,
};

UserPaymentsTable.defaultProps = {
  userProfile: false,
};
