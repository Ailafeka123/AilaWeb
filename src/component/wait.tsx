
import Style from '@/style/wait.module.scss';
export default function wait(){
    return(
        <div className={Style.waitDiv}>
            <h2>請稍等片刻...</h2>
        </div>
    )
}