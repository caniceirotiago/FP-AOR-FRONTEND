import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./Arrows.module.css";

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} ${styles.arrow} ${styles.nextArrow}`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faChevronRight} size="2x" />
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} ${styles.arrow} ${styles.prevArrow}`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faChevronLeft} size="2x" />
    </div>
  );
};

export { NextArrow, PrevArrow };
