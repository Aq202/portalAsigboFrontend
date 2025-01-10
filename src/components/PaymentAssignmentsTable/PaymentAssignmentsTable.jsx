/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './PaymentAssignmentsTable.module.css';
import Table from '../Table/Table';
import TableRow from '../TableRow/TableRow';
import UserPicture from '../UserPicture';
import UserNameLink from '../UserNameLink/UserNameLink';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import { serverHost } from '../../config';
import InputSearchSelect from '../InputSearchSelect/InputSearchSelect';
import PromotionsSearchSelect from '../PromotionsSearchSelect/PromotionsSearchSelect';
import SearchInput from '../SearchInput/SearchInput';
import Pagination from '../Pagination/Pagination';

function PaymentAssignmentsTable({ idPayment }) {
  const token = useToken();
  const {
    callFetch: callAssignmentsFetch,
    result: assignments,
    loading: loadingAssignments,
    error: errorAssignments,
  } = useFetch();

  const [filter, setFilter] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  const getPaymentAssignments = () => {
    const params = new URLSearchParams();
    if (filter.state) params.append('state', filter.state);
    if (filter.promotion) params.append('promotion', filter.promotion);
    if (filter.search) params.append('search', filter.search);
    params.append('page', currentPage);

    callAssignmentsFetch({
      uri: `${serverHost}/payment/${idPayment}/assignment?${params.toString()}`,
      headers: { authorization: token },
    });
  };

  const handleFilterChange = (name, value) => {
    setFilter((lastVal) => ({ ...lastVal, [name]: value }));
  };

  useEffect(() => {
    // Si la página no es la inicial, se reinicia
    // Se hace un return para evitar petición duplicada
    if (currentPage !== 0) {
      setCurrentPage(0);
      return;
    }
    getPaymentAssignments();
  }, [filter]);

  useEffect(() => {
    getPaymentAssignments();
  }, [currentPage]);

  return (
    <div className={styles.paymentAssignmentsTableContainer}>

      <div className={styles.filtersContainer}>
        <InputSearchSelect
          className={styles.selectInput}
          placeholder="Estado (todos)"
          value={filter.state}
          onChange={(e) => handleFilterChange('state', e.target.value)}
          options={
            [
              { title: 'Pagos pendientes', value: '0' },
              { title: 'Pagos completados', value: '1' },
              { title: 'Pagos confirmados', value: '2' },
              { title: 'Pagos atrazados', value: '3' },
            ]
          }
        />
        <PromotionsSearchSelect
          className={styles.selectInput}
          value={filter.promotion}
          onChange={(value) => handleFilterChange('promotion', value)}
        />
        <SearchInput
          className={styles.searchInput}
          handleSearch={(val) => handleFilterChange('search', val)}
        />
      </div>

      <Table
        showCheckbox={false}
        header={['No.', '', 'Usuario asignado', 'Estado', '']}
        breakPoint="900px"
        loading={loadingAssignments}
        showNoResults={!!errorAssignments && !assignments}
      >
        {assignments?.result?.map((assignment, index) => (
          <TableRow id={assignment.id} key={assignment.id}>
            <td>{index + 1}</td>
            <td className={styles.pictureRow}>
              <UserPicture
                name={assignment.user.name}
                idUser={assignment.user.id}
                hasImage={assignment.user.hasImage ?? false}
              />
            </td>
            <td className={styles.nameRow}>
              <UserNameLink
                idUser={assignment.user.id}
                name={`${assignment.user.name}
                ${assignment.user.lastname ?? ''}`}
              />
            </td>
            <td className={`${styles.statusRow} ${
              assignment.confirmed ? styles.confirmedStatus
                : assignment.completed ? styles.completedStatus
                  : styles.pendingStatus
            }`}
            >
              <span>
                {
                assignment.confirmed ? 'Confirmado'
                  : assignment.completed ? 'Por revisar'
                    : 'Pendiente'
              }
              </span>
            </td>
            <td className={styles.buttonRow}>
              <Link to={`/pago/asignacion/${assignment.id}`}>
                <button type="button" className={styles.assignmentDetailsButton}>Ver asignación</button>
              </Link>
            </td>
          </TableRow>
        ))}
      </Table>

      <Pagination
        totalPages={assignments?.pages}
        onChange={(e, page) => setCurrentPage(page - 1)}
        className={styles.pagination}
        currentPage={currentPage + 1}
      />

    </div>
  );
}

export default PaymentAssignmentsTable;

PaymentAssignmentsTable.propTypes = {
  idPayment: PropTypes.string.isRequired,
};

PaymentAssignmentsTable.defaultProps = {

};
