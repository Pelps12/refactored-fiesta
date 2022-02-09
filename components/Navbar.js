import Link from 'next/link';
import navStyles from '../styles/Navbar.module.css';

const Navbar = () => {
  return (
    <div className={navStyles.container}>
        <div className= {navStyles.wrapper}>
            <div className={navStyles.left}>
                <h1>Las-Las</h1>
            </div>
            <div className={navStyles.right}>
                <div className={navStyles.menuItem}>HOME</div>
                <div className={navStyles.menuItem}>ABOUT</div>
                <div className={navStyles.menuItem}>CONTACT</div>
                <button className = {navStyles.btn}>Become a Seller</button>
            </div>

        </div>
    </div>
  )
}

export default Navbar