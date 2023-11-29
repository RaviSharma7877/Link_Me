import React from 'react'
import styles from "../styles/Home.module.css"
import Image from 'next/image'
import img from '../images/userimg1.jpg'
import { useTheme } from "../components/hooks/ThemeContext";

function about() {
  const { theme } = useTheme();
  return (
    <div className={`${styles.aboutcontainer} bg-${theme}`}>
      <div className={`${styles.aboutimg} `}>
        <Image src={img} className={`border border-${theme=='light'? 'dark':'light'}`}></Image>
      </div>
      <div className={`${styles.aboutusdata} text-${theme=='light'? 'dark':'light'}`}>
        <h1>I'm Ravi</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum amet id, officia in repellendus corporis tempora qui ipsam voluptatibus enim officiis quia? Cum dolor exercitationem quidem voluptates distinctio sunt repellendus?</p>
      </div>
    </div>
  )
}

export default about