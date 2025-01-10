import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import styles from './PaymentDetails.module.css';
import DataField from '../DataField';
import UserPicture from '../UserPicture';
import UserNameLink from '../UserNameLink/UserNameLink';

function PaymentDetails({
  name, amount, limitDate, description, treasurers,
}) {
  return (
    <div className={styles.paymentDetailsContainer}>
      <DataField label="Concepto de pago" className={styles.completeRow}>{name}</DataField>
      <DataField label="Monto Q">{amount}</DataField>
      <DataField label="Fecha límite de pago">{dayjs(limitDate).format('DD/MM/YYYY')}</DataField>
      <DataField label="Descripción" className={styles.completeRow}>{description}</DataField>
      <span className={`${styles.dataLabel} ${styles.completeRow}`}>Tesoreros</span>
      {treasurers && (
      <ul className={`${styles.treasurerList} ${styles.completeRow}`}>
        {treasurers.map((treasurer) => (
          <li key={treasurer.id} className={styles.treasurerItem}>
            <UserPicture
              idUser={treasurer.id}
              name={treasurer.name}
              hasImage={treasurer.hasImage ?? false}
              className={styles.treasurerPicture}
            />
            <UserNameLink idUser={treasurer.id} name={`${treasurer.name} ${treasurer.lastname}`} />
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}

export default PaymentDetails;

PaymentDetails.propTypes = {
  name: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  limitDate: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  treasurers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    hasImage: PropTypes.bool,
  })).isRequired,
};

PaymentDetails.defaultProps = {

};
