import styles from "./styles.module.scss";
import {useLoading} from "../../contexts/LoadingContext.jsx";

const Loading = () => {
    const { hideLoading } = useLoading()

    return (
        <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
            <button className={styles.cancelButton} onClick={hideLoading}>Cancel</button>
        </div>
    );
};

export default Loading;
