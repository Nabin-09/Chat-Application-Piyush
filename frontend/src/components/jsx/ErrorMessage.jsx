import styles from '../css/ErrorMessage.module.css';

function ErrorMessage({ message }) {
  return message ? <p className={styles.text}>{message}</p> : null;
}

export default ErrorMessage;