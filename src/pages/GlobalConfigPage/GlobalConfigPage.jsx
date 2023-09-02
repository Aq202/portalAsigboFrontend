import React from 'react';
// import PropTypes from 'prop-types';
import { AiFillPlusCircle as PlusIcon } from 'react-icons/ai';
import { NavLink } from 'react-router-dom';
import styles from './GlobalConfigPage.module.css';
import AreasList from '../../components/AreasList/AreasList';

function GlobalConfigPage() {
  return (
    <div className={styles.globalConfigPage}>
      <h1>Configuración general</h1>
      <div className={styles.sectionHeader}>
        <h2>Ejes de ASIGBO</h2>
        <NavLink to="/area/nuevo">
          <PlusIcon className={styles.plusIcon} />
        </NavLink>
      </div>
      <AreasList />
    </div>
  );
}

export default GlobalConfigPage;

GlobalConfigPage.propTypes = {

};

GlobalConfigPage.defaultProps = {

};
