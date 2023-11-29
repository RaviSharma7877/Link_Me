import Image from 'next/image'
import React from 'react'
import styles from "../styles/Home.module.css"
import img from '../images/userimg1.jpg'
import { useTheme } from "../components/hooks/ThemeContext";
import Link from 'next/link';

function contact() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { theme } = useTheme();
  return (
    <div className={`${styles.contactcontainer} bg-${theme}`}>
      <div className={`${styles.contactimg} `}>
        <Image src={img} className={`border border-${theme=='light'? 'dark':'light'}`}></Image>
      </div>
      <div className={`${styles.contactusdata} text-${theme=='light'? 'dark':'light'}`}>
        <h1>Contact Us</h1>
        <div className={theme=='light'? `${styles.borderdark1}`:`${styles.borderlight1}`}>
          <div className={`${styles.inputdata}`}>
          <div>
            <input type='text' placeholder='Full Name' className={theme=='light'? `${styles.borderdark}`:`${styles.borderlight}`}></input>
            <input type='email' placeholder='E-mail' className={theme=='light'? `${styles.borderdark}`:`${styles.borderlight}`}></input>
            <input type='text' placeholder='Message' className={theme=='light'? `${styles.borderdark}`:`${styles.borderlight}`}></input>
            </div>
            <input type='submit' value="Contact Us" className={`${theme=='light'? "bg-dark":`bg-light`} ${theme=='light'? "text-light":`text-dark`}`}></input>
          </div>
          <div className={`${styles.connectdata}`}>
            <div>
            <h3>Contact</h3>
            <Link href="mailto:sraa7877@gmail.com">sraa7877@gmail.com</Link><br />
            <Link href={`tel:${7877173859}`}>7877173859</Link>
            </div>
            <div>
            <h3>Based in</h3>
            <p>Jaipur, Rajasthan,</p>
            <p>India</p>
            </div>
            <div className={`${styles.contactsocial}`}>
            <Link href=""><i class='bx bxl-linkedin-square'></i></Link>
            <Link href=""><i class='bx bxl-instagram-alt' ></i></Link>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default contact