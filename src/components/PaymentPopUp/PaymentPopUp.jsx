import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import PopUp from '@components/PopUp';
import InputText from '@components/InputText';
import InputNumber from '@components/InputNumber';
import InputDate from '@components/InputDate';
import TextArea from '@components/TextArea';
import Spinner from '../Spinner/Spinner';
import createPaymentSchema from './validationSchemas/createPaymentSchema';
import createActivityPaymentSchema from './validationSchemas/createActivityPaymentSchema';
import updatePaymentSchema from './validationSchemas/updatePaymentSchema';
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
 * @param paymentId Id del pago a editar. De no incluirse se creará un nuevo pago.
 * @returns
 */
function PaymentPopUp({
  isOpen, close, activity, className, paymentId,
}) {
  const token = useToken();
  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();
  const [isActivitySuccessOpen, openActivitySuccess, closeActivitySuccess] = usePopUp();
  const [isActivityErrorOpen, openActivityError, closeActivityError] = usePopUp();
  const [isUpdateSuccessOpen, openUpdateSuccess, closeUpdateSuccess] = usePopUp();
  const [isUpdateErrorOpen, openUpdateError, closeUpdateError] = usePopUp();

  const {
    form: paymentForm,
    error: paymentError,
    setData: setPaymentData,
    validateField: validatePaymentData,
    clearFieldError: clearPaymentError,
    validateForm: validatePaymentForm,
    clearForm,
  } = useForm(paymentId ? updatePaymentSchema : createPaymentSchema);

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
    error: errorActivityPayment,
    result: resultActivityPayment,
  } = useFetch();

  const {
    callFetch: getPaymentFetch,
    loading: loadingGetPayment,
    error: errorGetPayment,
    result: resultGetPayment,
  } = useFetch();

  const {
    callFetch: updatePaymentFetch,
    loading: loadingUpdatePayment,
    error: errorUpdatePayment,
    result: resultUpdatePayment,
  } = useFetch();

  useEffect(() => {
    if (!isOpen) clearForm();
  }, [isOpen]);

  useEffect(() => {
    if (activity && !paymentId) {
      setActivityPaymentData('name', `Pago de ${activity.name}`);
      setActivityPaymentData('idActivity', activity.id);
    }

    if (paymentId) {
      getPaymentFetch({
        headers: { authorization: token },
        uri: `${serverHost}/payment/${paymentId}`,
        method: 'GET',
      });
    }
  }, []);

  useEffect(() => {
    if (!resultGetPayment) return;

    setPaymentData('name', resultGetPayment.name);
    setPaymentData('amount', `${resultGetPayment.amount}`);
    setPaymentData('description', resultGetPayment.description);
    setPaymentData('treasurer', resultGetPayment.treasurer.map((t) => t.id));

    const dateObj = new Date(resultGetPayment.limitDate);
    const dateString = dateObj.toISOString().split('T')[0];
    setPaymentData('limitDate', dateString);
  }, [resultGetPayment]);

  const handleSubmit = async () => {
    if (activity) {
      const formErrors = await validateActivityPaymentForm();
      if (formErrors) return;

      const body = {
        name: activityPaymentForm.name.trim(),
        amount: activityPaymentForm.amount,
        description: activityPaymentForm.description.trim(),
        limitDate: activityPaymentForm.limitDate,
        treasurer: activityPaymentForm.treasurer,
        idActivity: activity.id,
      };

      submitActivityPaymentFetch({
        headers: { authorization: token },
        uri: `${serverHost}/payment/activity`,
        method: 'POST',
        body: JSON.stringify(body),
        parse: false,
      });
    } else {
      const formErrors = await validatePaymentForm();
      if (formErrors) return;

      const body = {
        name: paymentForm.name.trim(),
        amount: paymentForm.amount,
        description: paymentForm.description.trim(),
        limitDate: paymentForm.limitDate,
        treasurer: paymentForm.treasurer,
        promotion: paymentForm.promotion,
      };

      submitPaymentFetch({
        headers: { authorization: token },
        uri: `${serverHost}/payment`,
        method: 'POST',
        body: JSON.stringify(body),
        parse: false,
      });
    }
  };

  const handleUpdate = async () => {
    const formErrors = await validatePaymentForm();
    if (formErrors) return;

    const body = {
      name: paymentForm.name.trim(),
      amount: paymentForm.amount,
      description: paymentForm.description.trim(),
      limitDate: paymentForm.limitDate,
      treasurer: paymentForm.treasurer,
    };

    updatePaymentFetch({
      headers: { authorization: token },
      uri: `${serverHost}/payment/${paymentId}`,
      method: 'PATCH',
      body: JSON.stringify(body),
      parse: false,
    });
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

  useEffect(() => {
    if (resultActivityPayment) {
      openActivitySuccess();
    }
  }, [resultActivityPayment]);

  useEffect(() => {
    if (errorActivityPayment) {
      openActivityError();
    }
  }, [errorActivityPayment]);

  useEffect(() => {
    if (resultUpdatePayment) {
      openUpdateSuccess();
    }
  }, [resultUpdatePayment]);

  useEffect(() => {
    if (errorUpdatePayment) {
      openUpdateError();
    }
  }, [errorUpdatePayment]);

  const loading = loadingPayment || loadingActivityPayment || loadingUpdatePayment;

  // Verficar si el formulario tiene algún error
  const hasErrors = paymentError && Object.values(paymentError).some(
    (val) => val !== null && val !== undefined,
  );

  return (
    isOpen && (
    <PopUp closeWithBackground={false} close={close} maxWidth={1000} className={className || ''}>
      <div>
        <h1 className={styles.title}>{paymentId ? 'Actualizar pago' : 'Crear nuevo pago'}</h1>
        {!loadingGetPayment && !errorGetPayment && (
          <>
            <InputText
              title="Concepto de pago"
              value={activity && !paymentId ? activityPaymentForm?.name : paymentForm?.name}
              error={activity && !paymentId ? activityPaymentError?.name : paymentError?.name}
              onFocus={activity && !paymentId ? () => clearActivityPaymentError('name') : () => clearPaymentError('name')}
              onBlur={activity && !paymentId ? () => validateActivityPaymentData('name') : () => validatePaymentData('name')}
              onChange={activity && !paymentId ? (e) => setActivityPaymentData('name', e.target.value) : (e) => setPaymentData('name', e.target.value)}
            />
            <InputNumber
              title="Monto Q"
              value={activity && !paymentId ? activityPaymentForm?.amount : paymentForm?.amount}
              error={activity && !paymentId ? activityPaymentError?.amount : paymentError?.amount}
              onFocus={activity && !paymentId ? () => clearActivityPaymentError('amount') : () => clearPaymentError('amount')}
              onBlur={activity && !paymentId ? () => validateActivityPaymentData('amount') : () => validatePaymentData('amount')}
              onChange={activity && !paymentId ? (e) => setActivityPaymentData('amount', e.target.value) : (e) => setPaymentData('amount', e.target.value)}
              min={0}
              max={100000}
              className={styles.midSizeInput}
            />
            <InputDate
              title="Fecha límite de pago"
              value={activity && !paymentId ? activityPaymentForm?.limitDate
                : paymentForm?.limitDate}
              error={activity && !paymentId ? activityPaymentError?.limitDate
                : paymentError?.limitDate}
              onFocus={activity && !paymentId ? () => clearActivityPaymentError('limitDate') : () => clearPaymentError('limitDate')}
              onBlur={activity && !paymentId ? () => validateActivityPaymentData('limitDate') : () => validatePaymentData('limitDate')}
              onChange={activity && !paymentId ? (e) => setActivityPaymentData('limitDate', e.target.value) : (e) => setPaymentData('limitDate', e.target.value)}
              className={styles.midSizeInput}
            />
            <p className={styles.infoText}>
              En la descripción es importante mencionar detalles como el número de cuenta,
              propietario de la cuenta, el banco y tipo de cuenta a la que se debe de realizar
              el depósito.
            </p>
            <TextArea
              title="Descripción del pago"
              value={activity && !paymentId ? activityPaymentForm?.description
                : paymentForm?.description}
              error={activity && !paymentId ? activityPaymentError?.description
                : paymentError?.description}
              onFocus={activity && !paymentId ? () => clearActivityPaymentError('description') : () => clearPaymentError('description')}
              onBlur={activity && !paymentId ? () => validateActivityPaymentData('description') : () => validatePaymentData('description')}
              onChange={activity && !paymentId ? (e) => setActivityPaymentData('description', e.target.value) : (e) => setPaymentData('description', e.target.value)}
              className={styles.descriptionInput}
            />
            {!activity && !paymentId && (
            <CheckBox
              label="Asignar pago a todos los estudiantes becados"
              checked={paymentForm?.assignToAll}
              onChange={(e) => {
                setPaymentData('assignToAll', e.target.checked);
                if (e.target.checked) {
                  setPaymentData('promotion', consts.promotionsGroups.student);
                } else {
                  setPaymentData('promotion', undefined);
                }
              }}
            />
            )}
            {!activity && !paymentForm?.assignToAll && !paymentId && (
            <InputNumber
              title="Promoción"
              value={paymentForm?.promotion}
              error={paymentError?.promotion}
              onFocus={() => clearPaymentError('promotion')}
              onBlur={() => validatePaymentData('promotion')}
              onChange={(e) => setPaymentData('promotion', e.target.value)}
              min={2000}
              max={2100}
              className={styles.midSizeInput}
            />
            )}
            <h3 className={styles.subTitle}>Seleccionar tesoreros</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <UserSelectTable
                defaultSelectedUsers={resultGetPayment ? resultGetPayment.treasurer : null}
                onChange={activity && !paymentId ? (value) => {
                  setActivityPaymentData('treasurer', value);
                } : (value) => {
                  setPaymentData('treasurer', value);
                }}
              />
              {paymentError?.treasurer && (
                <span className={styles.errorMessage} style={{ marginTop: '25px' }}>
                  {paymentError.treasurer}
                </span>
              )}
            </div>

            {hasErrors && (
              <span className={styles.errorMessage} style={{ marginTop: '25px' }}>
                Existen errores en el formulario.
              </span>
            )}
            <div className={styles.buttons} style={{ display: 'flex', justifyContent: 'center', marginTop: '25px' }}>
              {loading && (
              <div className={styles.spinnerContainer}>
                <Spinner />
              </div>
              )}
              {!loading && (
                <div className={styles.buttonContainer}>
                  <Button text="Confirmar" onClick={paymentId ? handleUpdate : handleSubmit} />
                  <Button text="Cancelar" onClick={close} red />
                </div>
              )}
            </div>
          </>
        )}
        {loadingGetPayment && (
          <div className={styles.spinnerContainer}>
            <Spinner />
          </div>
        )}
        {errorGetPayment && (
        <div className={styles.errorMessage} style={{ marginTop: '25px', marginBottom: '25px', textAlign: 'center' }}>
          Ocurrió un error al cargar los detalles del pago. Por favor, inténtalo más tarde.
        </div>
        )}
      </div>
      <SuccessNotificationPopUp
        isOpen={isSuccessOpen}
        close={closeSuccess}
        text="El pago se ha creado exitosamente"
        callback={close}
      />
      <ErrorNotificationPopUp
        isOpen={isErrorOpen}
        close={closeError}
        text={errorPayment?.message || 'Ocurrió un error al crear el pago'}
      />
      <SuccessNotificationPopUp
        isOpen={isActivitySuccessOpen}
        close={closeActivitySuccess}
        text="El pago de actividad se ha creado exitosamente"
        callback={close}
      />
      <ErrorNotificationPopUp
        isOpen={isActivityErrorOpen}
        close={closeActivityError}
        text={errorActivityPayment?.message || 'Ocurrió un error al crear el pago de actividad'}
      />
      <SuccessNotificationPopUp
        isOpen={isUpdateSuccessOpen}
        close={closeUpdateSuccess}
        text="El pago se ha actualizado exitosamente"
        callback={close}
      />
      <ErrorNotificationPopUp
        isOpen={isUpdateErrorOpen}
        close={closeUpdateError}
        text={errorUpdatePayment?.message || 'Ocurrió un error al actualizar el pago'}
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
  paymentId: PropTypes.string,
};

PaymentPopUp.defaultProps = {
  isOpen: false,
  activity: null,
  className: '',
  paymentId: null,
};

export default PaymentPopUp;
