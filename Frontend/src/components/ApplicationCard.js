// ApplicationCard.js
import React from 'react';
import styles from '../styles/Home.module.css';// Import your styling

const ApplicationCard = ({ id, appStatus, img, name,userStatus, contact, email, skills, cv, portfolio }) => {
  return (
    <div className={styles.applicationCard}>
      <div className={styles.imgdetails}>
        <div className={styles.img}>
          <img src={img} alt="" />
        </div>
        <div className={styles.userdetails}>
          <h2>{name}</h2>
          <p>{userStatus}</p>
          <p>{contact}</p>
          <a href={`mailto:${email}`}>{email}</a>
        </div>
      </div>
      <div className={styles.skills}></div>
      <div className={styles.btns}></div>
    </div>
  );
};

export default ApplicationCard;
