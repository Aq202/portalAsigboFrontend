import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Route, Routes, useParams } from 'react-router-dom';
import styles from './PaymentDetailsPage.module.css';
import OptionsButton from '../../components/OptionsButton/OptionsButton';
import TabMenu from '../../components/TabMenu';
import PaymentDetails from '../../components/PaymentDetails/PaymentDetails';
import useFetch from '../../hooks/useFetch';
import { serverHost } from '../../config';
import useToken from '../../hooks/useToken';
import LoadingView from '../../components/LoadingView';
import NotFoundPage from '../NotFoundPage';
import PaymentAssignmentsTable from '../../components/PaymentAssignmentsTable/PaymentAssignmentsTable';

function PaymentDetailsPage() {
  const { idPago: idPayment } = useParams();
  const token = useToken();

  const {
    callFetch: callPaymentFetch,
    result: payment,
    loading: loadingPayment,
    error: errorPayment,
  } = useFetch();

  useEffect(() => {
    if (!idPayment) return;
    callPaymentFetch({
      uri: `${serverHost}/payment/${idPayment}`,
      headers: { authorization: token },
    });
  }, []);
  return (
    <>
      {payment && (
      <div className={styles.paymentDetailsPage}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Gestión de pago</h1>
          <OptionsButton options={[{ text: 'Eliminar' }, { text: 'Editar' }]} />
        </header>

        <TabMenu
          options={[
            { text: 'Detalles', href: '' },
            { text: 'Pagos asignados', href: 'asignaciones' },
          ]}
          className={styles.tabMenu}
          breakpoint="600px"
        />

        <Routes>
          <Route
            path=""
            element={(
              <PaymentDetails
                name={payment.name}
                amount={parseFloat(payment.amount)}
                limitDate={payment.limitDate}
                description={payment.description}
                treasurers={payment.treasurer}
              />
      )}
          />
          <Route
            path="asignaciones"
            element={
              <PaymentAssignmentsTable idPayment={idPayment} />
          }
          />
        </Routes>
      </div>
      )}
      {loadingPayment && <LoadingView />}
      {errorPayment && <NotFoundPage />}
    </>
  );
}

export default PaymentDetailsPage;

PaymentDetailsPage.propTypes = {};

PaymentDetailsPage.defaultProps = {};
