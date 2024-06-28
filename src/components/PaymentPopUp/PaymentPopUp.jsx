import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PopUp from '@components/PopUp';
import InputText from '@components/InputText';
import InputNumber from '@components/InputNumber';
import InputDate from '@components/InputDate';
import TextArea from '@components/TextArea';
import Spinner from '../Spinner/Spinner';
import createPaymentSchema from './validationSchemas/createPaymentSchema';
import createActivityPaymentSchema from './validationSchemas/createActivityPaymentSchema';
import useForm from '../../hooks/useForm';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import { serverHost } from '../../config';
import styles from './PaymentPopUp.module.css';
import CheckBox from '../CheckBox/CheckBox';
import Button from '../Button/Button';
import UserSelectTable from '../UserSelectTable/UserSelectTable';
import consts from '../../helpers/consts';
import SuccessNotificationPopUp from '../SuccessNotificationPopUp/SuccessNotificationPopUp';
import ErrorNotificationPopUp from '../ErrorNotificationPopUp/ErrorNotificationPopUp';
import usePopUp from '../../hooks/usePopUp';

/**
 * Popup para crear un pago.
 * @param activity Objeto con el id y nombre de la actividad {id, name}
 * De no incluirse este param, se creará un pago general.
 * @returns
 */
function PaymentPopUp({
  isOpen, close, activity, className,
}) {
  const token = useToken();
  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();

  const [validTreasurers, setValidTreasurers] = useState(false);

  const {
    form: paymentForm,
    error: paymentError,
    setData: setPaymentData,
    validateField: validatePaymentData,
    clearFieldError: clearPaymentError,
    validateForm: validatePaymentForm,
  } = useForm(createPaymentSchema);

  const {
    form: activityPaymentForm,
    error: activityPaymentError,
    setData: setActivityPaymentData,
    validateField: validateActivityPaymentData,
    clearFieldError: clearActivityPaymentError,
    validateForm: validateActivityPaymentForm,
  } = useForm(createActivityPaymentSchema);

  const {
    callFetch: submitPaymentFetch,
    loading: loadingPayment,
    error: errorPayment,
    result: resultPayment,
  } = useFetch();

  const {
    callFetch: submitActivityPaymentFetch,
    loading: loadingActivityPayment,
  } = useFetch();

  useEffect(() => {
    if (activity) {
      setActivityPaymentData('name', `Pago de ${activity.name}`);
      setActivityPaymentData('idActivity', `Pago de ${activity.id}`);
    }
  }, []);

  useEffect(() => {
  }, [activityPaymentForm, paymentForm]);

  const handleSubmit = async () => {
    if (activity) {
      const formErrors = await validateActivityPaymentForm();
      if (formErrors) return;

      submitActivityPaymentFetch({
        headers: { authorization: token },
        uri: `${serverHost}/payment/activity`,
        method: 'POST',
        body: JSON.stringify(activityPaymentForm),
        parse: false,
      });
    } else {
      const formErrors = await validatePaymentForm();
      if (formErrors) return;

      submitPaymentFetch({
        headers: { authorization: token },
        uri: `${serverHost}/payment`,
        method: 'POST',
        body: JSON.stringify(paymentForm),
        parse: false,
      });
    }
  };

  useEffect(() => {
    if (resultPayment) {
      openSuccess();
    }
  }, [resultPayment]);

  useEffect(() => {
    if (errorPayment) {
      openError();
    }
  }, [errorPayment]);

  const loading = loadingPayment || loadingActivityPayment;

  return (
    isOpen && (
    <PopUp closeWithBackground close={close} maxWidth={700} className={className || ''}>
      <div>
        <h1 className={styles.title}>Crear nuevo pago</h1>
        <InputText
          title="Concepto de pago"
          value={activity ? activityPaymentForm?.name : paymentForm?.name}
          error={activity ? activityPaymentError?.name : paymentError?.name}
          onFocus={activity ? () => clearActivityPaymentError('name') : () => clearPaymentError('name')}
          onBlur={activity ? () => validateActivityPaymentData('name') : () => validatePaymentData('name')}
          onChange={activity ? (e) => setActivityPaymentData('name', e.target.value) : (e) => setPaymentData('name', e.target.value)}
        />
        <div className={styles.inputContainer}>
          <InputNumber
            title="Monto Q"
            value={activity ? activityPaymentForm?.amount : paymentForm?.amount}
            error={activity ? activityPaymentError?.amount : paymentError?.amount}
            onFocus={activity ? () => clearActivityPaymentError('amount') : () => clearPaymentError('amount')}
            onBlur={activity ? () => validateActivityPaymentData('amount') : () => validatePaymentData('amount')}
            onChange={activity ? (e) => setActivityPaymentData('amount', e.target.value) : (e) => setPaymentData('amount', e.target.value)}
            min={0}
            max={100000}
          />
          <InputDate
            title="Fecha límite de pago"
            value={activity ? activityPaymentForm?.limitDate : paymentForm?.limitDate}
            error={activity ? activityPaymentError?.limitDate : paymentError?.limitDate}
            onFocus={activity ? () => clearActivityPaymentError('limitDate') : () => clearPaymentError('limitDate')}
            onBlur={activity ? () => validateActivityPaymentData('limitDate') : () => validatePaymentData('limitDate')}
            onChange={activity ? (e) => setActivityPaymentData('limitDate', e.target.value) : (e) => setPaymentData('limitDate', e.target.value)}
          />
        </div>
        <p className={styles.infoText}>
          En la descripción es importante mencionar detalles como el número de cuenta,
          propietario de la cuenta, el banco y tipo de cuenta a la que se debe de realizar
          el depósito.
        </p>
        <TextArea
          title="Descripción del pago"
          value={activity ? activityPaymentForm?.description : paymentForm?.description}
          error={activity ? activityPaymentError?.description : paymentError?.description}
          onFocus={activity ? () => clearActivityPaymentError('description') : () => clearPaymentError('description')}
          onBlur={activity ? () => validateActivityPaymentData('description') : () => validatePaymentData('description')}
          onChange={activity ? (e) => setActivityPaymentData('description', e.target.value) : (e) => setPaymentData('description', e.target.value)}
          className={styles.descriptionInput}
        />
        {!activity && (
          <CheckBox
            label="Asignar pago a todos los estudiantes becados"
            checked={paymentForm?.assignToAll}
            onChange={(e) => {
              setPaymentData('assignToAll', e.target.checked);
              if (e.target.checked) {
                setPaymentData('promotion', consts.promotionsGroups.student);
              }
            }}
          />
        )}
        {!activity && !paymentForm?.assignToAll && (
          <InputNumber
            title="Promoción"
            value={paymentForm?.promotion}
            error={paymentError?.promotion}
            onFocus={() => clearPaymentError('promotion')}
            onBlur={() => validatePaymentData('promotion')}
            onChange={(e) => setPaymentData('promotion', e.target.value)}
            min={2000}
            max={2100}
          />
        )}
        <h3 className={styles.subTitle}>Seleccionar tesoreros</h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <UserSelectTable
            onChange={activity ? (value) => {
              setActivityPaymentData('treasurer', value);
              if (value.length === 0) {
                setValidTreasurers(false);
              } else {
                setValidTreasurers(true);
              }
            } : (value) => {
              setPaymentData('treasurer', value);
              if (value.length === 0) {
                setValidTreasurers(false);
              } else {
                setValidTreasurers(true);
              }
            }}
          />
          {!validTreasurers
          && (
          <p className={styles.errorMessage} style={{ marginTop: '25px' }}>
            Debes seleccionar al menos un tesorero
          </p>
          )}
        </div>
        { loading && (
        <div className={styles.spinnerContainer}>
          <Spinner />
        </div>
        )}
        {!loading && (
          <div className={styles.buttons} style={{ display: 'flex', justifyContent: 'center', marginTop: '25px' }}>
            <Button text="Confirmar" onClick={handleSubmit} />
          </div>
        )}
      </div>
      <SuccessNotificationPopUp
        isOpen={isSuccessOpen}
        close={closeSuccess}
        message="El pago se ha creado exitosamente"
        callback={close}
      />
      <ErrorNotificationPopUp
        isOpen={isErrorOpen}
        close={closeError}
        message={errorPayment?.message || 'Ocurrió un error al crear el pago'}
      />
    </PopUp>
    )
  );
}

PaymentPopUp.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  activity: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
  className: PropTypes.string,
};

PaymentPopUp.defaultProps = {
  isOpen: false,
  activity: null,
  className: '',
};

export default PaymentPopUp;
