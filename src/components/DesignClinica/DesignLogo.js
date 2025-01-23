import style from "./_designLogo.module.css";
import LogoClinica from "../../assets/LogoClinica.png";

const DesignLogo = ({}) => {
  return (
    <>
      <div className={style.logoBox}>
        <img src={LogoClinica} alt="Logo da Clínica" className={style.logo} />
      </div>      
    </>
  );
};

export default DesignLogo;
