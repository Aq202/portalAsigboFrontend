/**
 * Si la promoción es un número, lo convierte a string y lo retorna.
 * Si es texto, devuelve su traducción a español.
 * @param {*} promotion
 */
const translatePromotion = (promotion) => {
  if (typeof promotion === 'number') {
    return promotion.toString();
  }

  // Verificar si es un número en string
  if (!Number.isNaN(parseInt(promotion, 10))) {
    return promotion;
  }

  switch (promotion) {
    case 'chick':
      return 'Pollito';
    case 'student':
      return 'Estudiante';
    case 'graduate':
      return 'Graduado';
    default:
      return promotion;
  }
};

export default translatePromotion;
