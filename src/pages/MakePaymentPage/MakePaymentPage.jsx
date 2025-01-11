import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './MakePaymentPage.module.css';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import { serverHost } from '../../config';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import LoadingView from '../../components/LoadingView/LoadingView';
import PaymentDetails from '../../components/PaymentDetails/PaymentDetails';
import ImagePicker from '../../components/ImagePicker/ImagePicker';
import Button from '../../components/Button/Button';
import Spinner from '../../components/Spinner/Spinner';
import usePopUp from '../../hooks/usePopUp';
import SuccessNotificationPopUp from '../../components/SuccessNotificationPopUp/SuccessNotificationPopUp';
import ErrorNotificationPopUp from '../../components/ErrorNotificationPopUp/ErrorNotificationPopUp';
import PaymentStatusMessage from '../../components/PaymentStatusMessage/PaymentStatusMessage';
import useToogle from '../../hooks/useToogle';
import ImageGallery from '../../components/ImageGallery/ImageGallery';
import getTokenPayload from '../../helpers/getTokenPayload';

function MakePaymentPage() {
  const token = useToken();
  const { idPaymentAssignment } = useParams();

  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();

  // Permite forzar una actualización de los datos del pago
  const [paymentTrigger, updatePaymentData] = useToogle();

  const navigate = useNavigate();

  const {
    callFetch: callPaymentFetch,
    result: paymentAssignment,
    error: paymentError,
    loading: paymentLoading,
  } = useFetch();

  const {
    callFetch: callCompletePaymentFetch,
    result: completePaymentResult,
    error: completePaymentError,
    loading: completePaymentLoading,
  } = useFetch();

  const handleImagePickerChange = (newImages) => {
    setImages(newImages);
  };

  const handleOnSubmit = (evt) => {
    evt.preventDefault();

    if (images.length === 0) {
      setError('Debes subir al menos un comprobante de pago.');
      return;
    }
    setError(null);
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('voucher', image, image.name);
    });

    // Realizar petición para completar el pago
    callCompletePaymentFetch({
      uri: `${serverHost}/payment/assignment/${idPaymentAssignment}/complete`,
      method: 'PATCH',
      body: formData,
      headers: { authorization: token },
      removeContentType: true, // No utilizar content type json por defecto
      parse: false, // No se recibe contenido
    });
  };

  const successCallback = () => {
    updatePaymentData();
  };

  useEffect(() => {
    callPaymentFetch({
      uri: `${serverHost}/payment/assignment/${idPaymentAssignment}`,
      headers: { authorization: token },
    });
  }, [paymentTrigger]);

  useEffect(() => {
    if (!paymentAssignment) return;

    // Si la asignación corresponde a otro usuario (admin o tesorero)
    // redirigir a la página de gestión del pago
    const { id } = getTokenPayload(token);
    if (paymentAssignment.user.id !== id) navigate(`/pago/asignacion/${idPaymentAssignment}`);
  }, [paymentAssignment]);

  useEffect(() => {
    // Si se completó el pago, abrir popup de éxito
    if (completePaymentResult) openSuccess();
  }, [completePaymentResult]);

  useEffect(() => {
    // Si ocurrió un error al completar el pago, abrir popup de error
    if (completePaymentError) openError();
  }, [completePaymentError]);

  const paymentCompleted = paymentAssignment?.completed;

  return (
    <>
      {paymentError && <NotFoundPage />}
      {paymentLoading && <LoadingView />}
      {paymentAssignment && (
      <form className={styles.makePaymentPage} onSubmit={handleOnSubmit}>
        <h1 className={styles.pageTitle}>Realizar Pago</h1>
        <PaymentDetails
          name={paymentAssignment.payment.name}
          amount={paymentAssignment.payment.amount}
          limitDate={paymentAssignment.payment.limitDate}
          description={paymentAssignment.payment.description}
          treasurers={paymentAssignment.payment.treasurer}
        />

        {!paymentCompleted ? (
          <>
            <p>
              Para realizar el pago, deposita el monto requerido en la cuenta especificada en la
              descripción. Posteriormente adjunta los comprobantes proporcionados por tu banco al
              realizar dicha transacción.
            </p>

            <h3 className={styles.subtitle}>Subir comprobantes de pago</h3>

            <ImagePicker maxFiles={3} onChange={handleImagePickerChange} />

            {error && <span className={styles.error}>{error}</span>}

            {!completePaymentResult && !completePaymentLoading && (
            <Button type="submit" text="Enviar comprobantes" className={styles.sendButton} />
            )}
            {completePaymentLoading && <Spinner className={styles.spinner} />}
          </>
        ) : (
          <>
            <PaymentStatusMessage
              className={styles.completedMessage}
              completed={paymentCompleted}
            />
            {paymentAssignment.vouchersKey.length > 0 && (
              <>
                <h3 className={styles.subtitle}>Recibo de pago</h3>
                <ImageGallery
                  images={paymentAssignment.vouchersKey.map(
                    (voucher, index) => ({ src: voucher, alt: `Recibo de pago ${index + 1}` }),
                  )}
                />
              </>
            )}
          </>
        )}
      </form>
      )}

      <SuccessNotificationPopUp
        close={closeSuccess}
        isOpen={isSuccessOpen}
        text="Los comprobantes de pago se han cargado con éxito. Ahora debes esperar a que el tesorero valide la información."
        callback={successCallback}
      />

      <ErrorNotificationPopUp
        close={closeError}
        isOpen={isErrorOpen}
        text={completePaymentError?.message ?? 'Ocurrió un error subir comprobantes de pago.'}
      />
    </>
  );
}

export default MakePaymentPage;

MakePaymentPage.propTypes = {

};

MakePaymentPage.defaultProps = {

};
