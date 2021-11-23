import { FaGithub } from 'react-icons/fa'
import { FiX} from 'react-icons/fi'
import styles from './styles.module.scss'
 
const userLoggedIn = true; 

export function SignInButton() {
        return userLoggedIn ? (
            <button className={styles.signInButton}><FaGithub color='#04d361' /> @gabrikf <FiX className={styles.closeIcon} color='#737380'/> </button>
        ):
        (
            <button className={styles.signInButton}><FaGithub color='#eba417' />Sign in with Github </button>
        )
    }