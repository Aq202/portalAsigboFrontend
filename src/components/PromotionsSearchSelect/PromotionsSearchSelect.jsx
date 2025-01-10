import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import { serverHost } from '../../config';
import InputSearchSelect from '../InputSearchSelect/InputSearchSelect';
import translatePromotion from '../../helpers/translatePromotion';

function PromotionsSearchSelect({
  value, onChange, disabled, className,
}) {
  const token = useToken();
  const {
    callFetch: getPromotionsFetch,
    result: promotions,
    loading: loadingPromotions,
    error: errorPromotions,
  } = useFetch();

  useEffect(() => {
    getPromotionsFetch({ uri: `${serverHost}/promotion`, headers: { authorization: token } });
  }, []);
  return (
    <InputSearchSelect
      className={className}
      placeholder="Promoción (todos)"
      value={value}
      onChange={(e) => { if (onChange) onChange(e.target.value); }}
      options={
            promotions
              ? [
                ...promotions.notStudents.map(
                  (val) => ({ value: val, title: translatePromotion(val) }),
                ),
                {
                  value: promotions.students.id,
                  title: translatePromotion(promotions.students.id),
                },
                ...promotions.students.years.map((year) => ({ value: `${year}`, title: `${year}` })),
              ]
              : null
          }
      disabled={disabled || errorPromotions || loadingPromotions}
    />
  );
}

export default PromotionsSearchSelect;

PromotionsSearchSelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

PromotionsSearchSelect.defaultProps = {
  onChange: null,
  value: '',
  disabled: false,
  className: '',
};
