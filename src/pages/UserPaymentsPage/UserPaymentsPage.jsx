import React from 'react';
// import PropTypes from 'prop-types';
import styles from './UserPaymentsPage.module.css';
import UserPaymentsTable from '../../components/UserPaymentsTable/UserPaymentsTable';
import useSessionData from '../../hooks/useSessionData';

function UserPaymentsPage() {
  const sessionData = useSessionData();

  return (
    <div className={styles.userPaymentsPage}>
      <h1 className={styles.pageTitle}>Mis pagos</h1>
      <p>
        Consulta los montos pendientes, realiza tus pagos y revisa tu historial de operaciones.
      </p>
      {sessionData?.id && <UserPaymentsTable idUser={sessionData.id} />}
    </div>
  );
}

export default UserPaymentsPage;

UserPaymentsPage.propTypes = {

};

UserPaymentsPage.defaultProps = {

};
