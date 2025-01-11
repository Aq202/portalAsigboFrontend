/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import LightGallery from 'lightgallery/react';
import PropTypes from 'prop-types';

// Importar estilos y plugins de galeria
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import styles from './ImageGallery.module.css';

function ImageGallery({ images }) {
  return (
    <div className="App">
      <LightGallery
        speed={500}
        plugins={[lgThumbnail, lgZoom]}
        className="hola"
      >
        {images?.map((img) => (
          <a href={img.src}>
            <img
              alt={img.alt}
              src={img.src}
              className={styles.image}
            />
          </a>
        ))}
      </LightGallery>
    </div>
  );
}

export default ImageGallery;

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
  })).isRequired,
};
