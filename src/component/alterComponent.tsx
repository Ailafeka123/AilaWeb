"use client";

type inputProps = {
    openState:boolean,
    onOpenState:(value:[boolean,string]) => void,
    alterMessage :string,

}
import Style from "@/style/alterComponent.module.scss"

export default function AlterComponent ({openState, onOpenState,alterMessage}:inputProps){
    return(
        <div className={`${Style.backgroundDiv} ${openState === false?  Style.alterDivHidden:""}` }>
            <div className={`${Style.alterDiv} `}>
                <div className={Style.alterTextDiv}>
                    {alterMessage}
                </div>
                <div className={Style.alterButtonDiv}>
                    <button type="button" onClick={()=>{onOpenState([false,""])}}>確認</button>
                </div>
            </div>
        </div>
    
    )
}