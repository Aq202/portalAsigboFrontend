import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import dayjs from 'dayjs';
import styles from './GeneralPaymentsPage.module.css';
import Button from '../../components/Button/Button';
import Table from '../../components/Table/Table';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import TableRow from '../../components/TableRow/TableRow';
import translatePromotion from '../../helpers/translatePromotion';
import usePopUp from '../../hooks/usePopUp';
import PaymentPopUp from '../../components/PaymentPopUp/PaymentPopUp';

function GeneralPaymentsPage() {
  const token = useToken();

  const [isPaymentPopUpOpen, openPaymentPopUp, closePaymentPopUp] = usePopUp(false);

  const {
    callFetch: fetchPayments,
    result: payments,
    loading: loadingPayments,
    error: paymentsError,
  } = useFetch();

  useEffect(() => {
    fetchPayments({ uri: `${serverHost}/payment`, headers: { authorization: token } });
  }, []);

  return (
    <div className={styles.generalPaymentsPage}>
      <header className={styles.pageHeader}>
        <h1>Listado de pagos generales</h1>
        <Button text="Nuevo pago" onClick={openPaymentPopUp} className={styles.newPaymentButton} />
      </header>
      <Table
        header={['No.', 'Concepto', 'Promoción', 'Fecha límite']}
        showCheckbox={false}
        loading={loadingPayments}
        showNoResults={paymentsError}
        breakPoint="900px"
      >
        {payments?.map((payment, index) => (
          <TableRow key={payment.id} id={payment.id}>
            <td>{index + 1}</td>
            <td><NavLink to={`/pago/${payment.id}`} className={styles.nameLink}>{payment.name}</NavLink></td>
            <td>{translatePromotion(payment.targetUsers)}</td>
            <td>{dayjs(payment.limitDate).format('DD/MM/YYYY')}</td>
          </TableRow>
        ))}
      </Table>

      <PaymentPopUp isOpen={isPaymentPopUpOpen} close={closePaymentPopUp} />
    </div>
  );
}

export default GeneralPaymentsPage;

GeneralPaymentsPage.propTypes = {};

GeneralPaymentsPage.defaultProps = {};
