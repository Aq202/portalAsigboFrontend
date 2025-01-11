/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { FaMoneyBill as MoneyIcon } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styles from './PaymentStatusMessage.module.css';

/**
 * Muestra un mensaje que indica si un pago ya fue completado (recibos enviados) o confirmado
 * por el tesorero. Por default, el mensaje está pendiente
 * @param {bool} completed. Indica si el usuario ya envió los comprobantes.
 * @param {bool} confirmed. Indica si el pago fue confirmado por el tesorero.
 */
function PaymentStatusMessage({
  completed, confirmed, link, className,
}) {
  return (
    <div className={`${styles.paymentStatusMessage} ${completed ? styles.completed : ''} ${confirmed ? styles.confirmed : ''} ${className}`}>
      <MoneyIcon className={styles.icon} />
      <span className={styles.message}>
        {completed ? 'Recibo de pago enviado. Pendiente de confirmación.'
          : confirmed ? 'Pago confirmado.'
            : 'Pago pendiente de realizarse.'}
      </span>
      {link && (
        <Link to={link} className={styles.link}>Ver aquí</Link>
      )}
    </div>
  );
}

export default PaymentStatusMessage;

PaymentStatusMessage.propTypes = {
  completed: PropTypes.bool,
  confirmed: PropTypes.bool,
  link: PropTypes.string,
  className: PropTypes.string,
};

PaymentStatusMessage.defaultProps = {
  completed: false,
  confirmed: false,
  link: null,
  className: '',
};
