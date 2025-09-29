import * as React from "react";
import styles from "./Card.module.scss";

interface CardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  colors: {
    bg: string;
    icon: string;
  };
}

const Card: React.FC<CardProps> = ({ title, value, icon, colors }) => {
  return (
    <div className={styles.card}>
      <div className={styles["card-content"]}>
        <p className={styles["card-title"]}>{title}</p>
        <p className={styles["card-value"]}>{value}</p>
      </div>
      <div
        className={styles["card-icon"]}
        style={{ backgroundColor: colors.bg }}
      >
        {React.cloneElement(icon, {
          style: { color: colors.icon },
        })}
      </div>
    </div>
  );
};

export default Card;
