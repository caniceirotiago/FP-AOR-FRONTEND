import React from 'react';
import styles from './InitialPage.module.css';
import background from '../../assets/background.jpg';



const InitialPage = () => {
  return (
    <div className={styles.initialPage} >
      <div className={styles.content}>
        <div className={styles.card2}>
          <img className={styles.image} src={background} alt="alt" />
        </div>
        <div className={styles.card1}>
          <h1 className={styles.title}>Welcome to Critical Lab!</h1>
          <p className={styles.subtitle}>Explore. Inove. Avance.</p>
          <div className={styles.buttons}>
            <button className={styles.button} onClick={() => alert("Ir para a aplicação!")}>Entrar na Aplicação</button>
            <button className={styles.button} onClick={() => alert("Ir para o registo!")}>Registar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialPage;
