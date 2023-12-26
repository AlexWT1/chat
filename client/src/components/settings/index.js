import PropTypes from 'prop-types';

import ThemeContrast from './ThemeContrast';

ThemeSettings.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function ThemeSettings({ children }) {
  return <ThemeContrast>{children}</ThemeContrast>;
}
