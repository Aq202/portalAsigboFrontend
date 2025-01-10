import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Pagination as MuiPagination } from '@mui/material';

function Pagination({
  totalPages, currentPage, onChange, className,
}) {
  const [paginationItems, setPaginationItems] = useState();

  useEffect(() => {
    // cambiar número en la paginación
    const media = matchMedia('(max-width:700px)');

    const handleMediaChange = (e) => {
      if (e.matches) setPaginationItems(0);
      else setPaginationItems(2);
    };

    media.onchange = handleMediaChange;
    handleMediaChange(media);

    return () => { media.onchange = null; };
  }, []);

  return (
    <MuiPagination
      count={totalPages}
      siblingCount={paginationItems}
      className={className}
      onChange={onChange}
      page={currentPage}
    />
  );
}

export default Pagination;

Pagination.propTypes = {
  totalPages: PropTypes.number,
  currentPage: PropTypes.number,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

Pagination.defaultProps = {
  totalPages: 0,
  currentPage: 1,
  onChange: null,
  className: '',
};
