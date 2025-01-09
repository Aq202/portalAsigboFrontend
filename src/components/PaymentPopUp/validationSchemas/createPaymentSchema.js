import * as yup from 'yup';

export default yup.object().shape({
  promotion: yup.mixed()
    .test(
      'is-string-or-number',
      'La promoción debe ser una cadena o un número.',
      (value) => typeof value === 'string' || typeof value === 'number',
    )
    .test(
      'is-valid-number',
      'La promoción debe ser un número entre 2000 y 2100.',
      (value) => typeof value === 'string' || (typeof value === 'number' && value >= 2000 && value <= 2100),
    )
    .required('Es necesario indicar una promoción para el pago'),
  treasurer: yup
    .array()
    .of(
      yup
        .string()
        .required("El campo 'treasurer' debe contener id's válidos."),
    )
    .typeError("El campo 'treasurer' debe ser un arreglo.")
    .min(1, 'Debe seleccionar al menos un tesorero.')
    .required('Es necesario al menos un tesorero'),
  limitDate: yup
    .date()
    .nullable()
    .typeError('Se necesita una fecha válida.')
    .required('Es necesaria una fecha límite'),
  description: yup.string().required('Es necesaria una descripción'),
  amount: yup
    .number()
    .nullable()
    .typeError('La cantidad debe ser una número.')
    .min(1, 'El monto debe ser mayor a cero.')
    .required('Es necesaria una cantidad a pagar'),
  name: yup.string().required('Es necesario un concepto de pago'),
});
