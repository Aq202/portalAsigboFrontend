import * as yup from 'yup';

export default yup.object().shape({
  treasurer: yup
    .array()
    .of(
      yup
        .string()
        .required("El campo 'treasurer' debe contener id's válidos."),
    )
    .typeError("El campo 'treasurer' debe ser un arreglo.")
    .min(1, 'Es necesario al menos un responsable del área.')
    .required('Es necesario al menos un tesorero.'),
  limitDate: yup
    .date()
    .nullable()
    .typeError("El campo 'limitDate' debe ser una fecha válida.")
    .required('Es necesaria una fecha límite'),
  description: yup.string().required('Es necesaria una descripción'),
  amount: yup
    .number()
    .nullable()
    .typeError("El campo 'amount' debe ser una número.")
    .min(0, "El campo 'amount' debe ser mayor o igual a cero.")
    .required('Es necesaria una cantidad a pagar'),
  name: yup.string().required('Es necesario un concepto de pago'),
  idActivity: yup
    .string()
    .nullable()
    .required("El campo 'idActivity' es obligatorio."),
});
