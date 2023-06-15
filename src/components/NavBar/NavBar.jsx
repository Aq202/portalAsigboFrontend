import './NavBar.scss';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LogoLetrasBlancas from '../../assets/General/Copia de Transparente (letras blancas).png';
import MenuIcon from '../../assets/icons/MenuIcon';
import NavMenuButton from './NavMenuButton/NavMenuButton';
import XIcon from '../../assets/icons/XIcon';
import LogOutIcon from '../../assets/icons/LogOutIcon';

function NavBar({ children }) {
  const [isToggled, setToggle] = useState(true);

  const toggleMenu = () => {
    setToggle(!isToggled);
  };

  const strokes = '#16337F';

  return (
    <>
      <div className="NavBar">
        <button type="button" className="logoButton">
          <img src={LogoLetrasBlancas} alt="Logo de ASIGBO" />
        </button>
        <button className="icon" onClick={toggleMenu} type="button">
          <MenuIcon fill="none" stroke="#ffffff" />
        </button>
      </div>
      <div className={`pageContent ${isToggled ? 'showBar' : 'hideBar'}`}>
        <div className="NavMenu">
          <div className="buttons">
            <div className="buttonOverlay center">
              <NavMenuButton label="Menú1" icon={<MenuIcon fill="none" stroke={strokes} />} />
              <NavMenuButton label="Ajustes" icon={<XIcon fill={strokes} stroke={strokes} />} />
            </div>
            <div className="buttonOverlay bottom">
              <NavMenuButton label="Cerrar Sesión" icon={<LogOutIcon fill={strokes} stroke={strokes} width="70%" height="70%" />} />
            </div>
          </div>
        </div>
        <div className="content">
          {children}
        </div>
      </div>
    </>
  );
}

NavBar.defaultProps = {
  children: '',
};

NavBar.propTypes = {
  children: PropTypes.node,
};

export default NavBar;
