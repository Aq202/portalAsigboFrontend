import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PopUp from '@components/PopUp';
import { BiSolidCloudUpload } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import readXlsxFile from 'read-excel-file';
import styles from './ImportUsersPopUp.module.css';
import consts from '../../helpers/consts';

function ImportExcelPopUp({ close, isOpen }) {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const cleanAndClose = () => {
    close();
    setError(false);
    setErrorMessage('');
  };

  const handleChange = async (e) => {
    const file = e.target.files[0];

    if (!file || !['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(file.type)) {
      setError(true);
      setErrorMessage('Tipo de archivo incorrecto, debe adjuntar un archivo de tipo .xlsx o .xls');
      return;
    }

    try {
      const rows = await readXlsxFile(file);

      if (rows.length === 0) {
        setError(true);
        setErrorMessage('El archivo está vacío.');
        return;
      }

      const headers = rows[0].map((header) => header.trim());
      if (headers.toString() !== consts.importHeaders.toString()) {
        setError(true);
        setErrorMessage('Formato incorrecto. Se espera que los encabezados sean: "Nombres, Apellidos, Correo, Promoción, Carrera, Universidad, Campus y Sexo".');
        return;
      }

      const data = rows.slice(1).map((row) => headers.reduce((acc, header, index) => {
        acc[header] = row[index] || '';
        return acc;
      }, {}));

      navigate('/usuario/importar', {
        state: { data },
        replace: true,
      });

      cleanAndClose();
    } catch (err) {
      setError(true);
      setErrorMessage('Ocurrió un error al leer el archivo.');
    }
  };

  return (
    isOpen && (
      <PopUp close={cleanAndClose} maxWidth={700}>
        <div className={styles.container}>
          <span className={styles.downloadMessage}>
            Descarga la plantilla para subir usuarios
            {' '}
            <a href={`/${consts.usersTemplateFile}`}>aquí</a>
            .
          </span>
          <label htmlFor="importExcel">
            <BiSolidCloudUpload style={{ fontSize: '10em', color: '#16337F', margin: '-20px 0' }} />
            <h2>Importar información</h2>
            <p>Haz click o arrastra y suelta el archivo.</p>
            <input
              id="importExcel"
              type="file"
              onChange={handleChange}
            />
          </label>
          <p style={{
            color: 'red',
            display: `${error ? 'block' : 'none'}`,
            fontSize: '0.8em',
            textAlign: 'center',
          }}
          >
            {errorMessage}
          </p>
        </div>
      </PopUp>
    )
  );
}

export default ImportExcelPopUp;

ImportExcelPopUp.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
};

ImportExcelPopUp.defaultProps = {
  isOpen: false,
};
